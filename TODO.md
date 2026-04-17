# TODO: Ujian Enhancements

**Status: In Progress**

## Previous (Done):
1. [x] Rename Dashboard → 'lanjut stage' (conditional >=80%).

## New Feature: Tombol Pembahasan Soal - ✅ COMPLETED

1. [x] Add "Pembahasan Soal" button in results action-grid (always visible post-quiz).
2. [x] On click: Modal shows all soal with pertanyaan, your answer (red), correct answer (green ✅/❌), pembahasan.
3. [x] Styled with neon theme, responsive modal.

**Features:**
- Button always available after results.
- Uses soal.pemahasan from data.json.
- Handles unanswered soal.
- Close via overlay or ×.

Test: Complete quiz → click 📚 Pembahasan Soal → review all.

**Demo:** `start EL-LEARN\\ujian.html?stage=sd-k1-s1`

## Latest: Full Reset on Logout ✓
- logout() now clears USERNAME, PROGRESS, XP, STREAK, LAST_LOGIN, ellearn_scores.
- New login = stage 1 fresh start.
