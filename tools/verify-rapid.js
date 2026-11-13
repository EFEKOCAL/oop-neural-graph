#!/usr/bin/env node
/*
 * verify-rapid.js — Hızlandırılmış öğrenme modundaki tüm Java kodlarını doğrular.
 *
 *   node tools/verify-rapid.js
 *
 * - snippet ve pratik çözümleri: javac --release 17 ile derler, çalıştırır, çıktıyı `output` ile karşılaştırır.
 * - givenKind 'program': verilen kodun kendisi çalıştırılır, çıktısı cevapla aynı olmalı.
 * - givenKind 'buggy': verilen kod DERLENMEMELİ; javac'ın hata verdiği satırlar `bugs` ile aynı olmalı.
 * Satır sonlarındaki boşluklar karşılaştırmada yok sayılır.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/data/rapid-content.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/data/rapid-notes.js'), 'utf8'), ctx);
const R = ctx.window.OOPLab.rapid;
const N = ctx.window.OOPLab.rapidNotes;

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rapid-'));
const norm = (s) => String(s).replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

function compile(name, main, code) {
  const dir = path.join(work, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, main + '.java'), code, 'utf8');
  const r = spawnSync('javac', ['--release', '17', '-encoding', 'UTF-8', '-Xlint:none', '-Xmaxerrs', '100', main + '.java'], { cwd: dir, encoding: 'utf8' });
  return { dir, ok: r.status === 0, err: (r.stderr || '') + (r.stdout || '') };
}

function run(dir, main, args) {
  const r = spawnSync('java', ['-Dstdout.encoding=UTF-8', '-Dfile.encoding=UTF-8', '-cp', '.', main, ...(args || [])], { cwd: dir, encoding: 'utf8' });
  return { ok: r.status === 0, out: r.stdout || '', err: r.stderr || '' };
}

let pass = 0;
let fail = 0;
function check(label, cond, detail) {
  if (cond) { pass++; console.log('  ok   ' + label); }
  else { fail++; console.log('  FAIL ' + label + (detail ? '\n' + detail.replace(/^/gm, '       ') : '')); }
}

function runProgram(label, main, code, expected, args) {
  const c = compile(label.replace(/\W+/g, '_'), main, code);
  if (!c.ok) return check(label + ' derlenir', false, c.err);
  const r = run(c.dir, main, args);
  if (!r.ok) return check(label + ' çalışır', false, r.err);
  const got = norm(r.out);
  check(label + ' çıktısı', got === norm(expected), `beklenen:\n${norm(expected)}\nalınan:\n${got}`);
}

// Kenar notları: her çapa kodda bulunmalı ve gerçekten var olan bir kod parçasına bağlı olmalı
function checkNotes(key, src) {
  const notes = N.map[key];
  if (!notes) return;
  const res = N.resolve(src, notes);
  const missing = notes.filter((n, i) => !res[i]).map((n) => n[0]);
  check(`${key} kenar notları (${notes.length})`, missing.length === 0, 'bulunamayan çapa: ' + missing.join(' | '));
}
const codeKeys = new Set(['ozet:template']);
for (const u of R.units) {
  (u.snippets || []).forEach((s, i) => codeKeys.add(`${u.id}:${i}`));
  if (u.practice && u.practice.answer && u.practice.answer.code) codeKeys.add(`${u.id}:answer`);
}
Object.keys(N.map).forEach((k) => check(`not anahtarı ${k} bir koda bağlı`, codeKeys.has(k)));

for (const u of R.units) {
  console.log(`${u.no} ${u.title}`);
  (u.snippets || []).forEach((s, i) => checkNotes(`${u.id}:${i}`, s.code));
  if (u.practice && u.practice.answer && u.practice.answer.code) checkNotes(`${u.id}:answer`, u.practice.answer.code);
  (u.snippets || []).forEach((s, i) => runProgram(`${u.id}-s${i + 1} ${s.main}`, s.main, s.code, s.output, s.args));
  const p = u.practice;
  if (!p) continue;
  if (p.givenKind === 'program') runProgram(`${u.id}-verilen ${p.givenMain}`, p.givenMain, p.given, p.answer.output);
  if (p.givenKind === 'buggy') {
    const c = compile(u.id + '-buggy', p.givenMain, p.given);
    check(`${u.id}-verilen derlenmemeli`, !c.ok);
    const lines = [...new Set([...c.err.matchAll(/\.java:(\d+): error/g)].map((m) => Number(m[1])))].sort((a, b) => a - b);
    check(`${u.id}-hata satırları ${JSON.stringify(p.bugs)}`, JSON.stringify(lines) === JSON.stringify(p.bugs), `javac satırları: ${JSON.stringify(lines)}\n${c.err}`);
  }
  if (p.answer && p.answer.code) runProgram(`${u.id}-çözüm ${p.answer.main}`, p.answer.main, p.answer.code, p.answer.output);
}

console.log('Son gün tekrar sayfası');
checkNotes('ozet:template', R.summary.template.code);
runProgram('ozet şablon', R.summary.template.main, R.summary.template.code, R.summary.template.output);

fs.rmSync(work, { recursive: true, force: true });
console.log(`\n${pass} başarılı, ${fail} başarısız`);
process.exit(fail ? 1 : 0);
