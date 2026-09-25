# Audit MKL Main: halaman, konten, copywriting, SEO, dan information architecture

Tanggal inspeksi: **23 September 2026**. Surface utama: **marikitalembur.com**. Repository: **Custompedia/MKL-Website**. Branch otoritatif: **claude/mkl-gates-0-3-qcwjyk**. SHA yang diperiksa: **2306511a5488c1cc9f283698976f77a891634837**.

Laporan ini adalah bahan handoff, bukan implementasi. Tidak ada arahan warna, tipografi, gaya visual, grid, ilustrasi, animasi, atau sistem desain. Semua copy usulan adalah **COPY EXPLORATION**, bukan copy yang sudah dipublikasikan atau klaim baru yang otomatis disetujui.

## 1. Executive summary

**MKL Main sudah memiliki fondasi rute dan pemisahan data yang cukup baik, tetapi konten publik belum menjelaskan manfaat produk dan layanan secara memadai.** Masalah terbesar bukan kekurangan jumlah halaman: halaman Mari Rekap hampir kosong, penjelasan platform terlalu dominan, jalur B2B belum memiliki halaman, dan sebagian halaman CMS masih membawa model bisnis lama.

Rekomendasi inti: pertahankan `/produk-kami`, `/kelas`, `/untuk-partner`, dan `/ajukan-kebutuhan`; tambahkan perjalanan konten `/untuk-bisnis`; perbaiki isi `/tentang`; pertahankan Market sebagai surface terpisah. Jangan menambah Insight, produk, kelas, testimoni, atau bukti hasil untuk membuat situs tampak lebih lengkap.

| Prioritas | Temuan terbukti | Implikasi untuk redesign |
|---|---|---|
| P0 | `/produk-kami` menampilkan “Ringkasan produk ini belum ditulis di katalog”; detail Mari Rekap tidak menampilkan manfaat, alur, kemampuan, atau batasan | Lengkapi konten produk sebelum membawa lebih banyak pengunjung ke detail |
| P0 | CTA “Buka Aplikasi” pada sesi browser yang sudah memiliki akses menuju `/apps/marirekap`; URL itu 404 | Perlu perbaikan tujuan akses berbasis kontrak aplikasi, bukan sekadar mengganti label |
| P0 | `/untuk-bisnis` 404 dan tidak ada di navigasi | Buat satu halaman B2B yang utuh, dengan intake existing sebagai tujuan |
| P0 | `/kerja-sama` masih mengiklankan Etalase dan Growth sebagai jalur mandiri | Hentikan pertentangan dengan business SoT; jadikan compatibility/orientation page |
| P0 | Tentang dan halaman kebijakan memuat klaim pembayaran, pengujian, trial, dan refund yang belum selaras dengan evidence aktif | Rekonsiliasi klaim; jangan menganggap isi CMS yang terbit otomatis benar |
| P0 | Tujuh harga Mari Rekap sudah terlihat, tetapi pembayaran publik masih ditutup | Bedakan produk terbit, harga terpasang, akses pengguna existing, dan pembelian publik |
| P1 | Halaman detail mengeluarkan dua canonical identik; OG dan JSON-LD tidak ditemukan pada halaman HTML yang diperiksa | Rapikan metadata sebelum aktivasi discovery |
| P1 | Sitemap source melewatkan `/produk-kami` dan halaman CMS, tetapi memasukkan dua route legacy | Perbaiki pemilihan URL sebelum indexing diaktifkan |
| P1 | Hero/penjelasan Produk menonjolkan akun, registry, dan struktur aplikasi | Ganti dengan manfaat, siapa pengguna, dan langkah berikutnya |
| KEEP | Kelas dan Market menunjukkan inventaris kosong secara jujur; TulisAI tidak ditemukan pada daftar publik | Pertahankan empty state dan batas rilis |

**Batas audit yang material:** complete inventory di laporan berarti seluruh pola rute dalam router yang diperiksa, seluruh halaman/link publik yang ditemukan, serta delapan kategori yang ditautkan homepage. Tidak tersedia konektor D1 untuk mengekspor seluruh baris CMS/catalog. Karena `/:slug` membaca CMS dinamis, audit ini tidak dapat membuktikan bahwa tidak ada halaman terbit lain yang tidak tertaut. Jangan menyebut inventaris ini sebagai ekspor seluruh database production.

**Pengecualian terhadap niat read-only:** satu GET anonim ke `/apps/hitungin` dilakukan untuk memeriksa keberadaan route. Setelah itu ditemukan bahwa loader-nya dapat membuat guest organization, workspace, dan trial saat halaman dibuka tanpa cookie. Responsnya 200; mutasi tersebut sangat mungkin terjadi berdasarkan source, tetapi baris production tidak diperiksa. Tidak ada form, kalkulasi, order, atau pembayaran yang dikirim. Karena itu konfirmasi “Runtime mutation: NONE” tidak dapat diberikan secara jujur. Tidak ada cleanup atau mutasi lanjutan dilakukan.

## 2. Baseline repository dan evidence

### 2.1 Baseline yang tepat

- HEAD dikonfirmasi melalui integrasi GitHub sebelum inspeksi, kemudian dikonfirmasi ulang pada **08:20 UTC / 15:20 WIB**: tetap `2306511a5488c1cc9f283698976f77a891634837`.
- Commit tersebut adalah merge rekonsiliasi dokumentasi PR #23. SHA lama yang diberikan pengguna ternyata masih current.
- Tidak ada remote Git HTTPS melalui terminal, fetch/pull/push, branch baru, worktree, staging, commit, PR, merge, atau deployment.
- Source dibaca dari SHA immutable melalui integrasi GitHub. Public HTML diperiksa melalui GET anonim; homepage, Produk, dan detail Mari Rekap juga dibaca melalui browser. Browser ternyata mempunyai sesi akses existing; observasi sesi itu tidak diperlakukan sebagai keadaan pengunjung anonim.
- Receipt di SoT menyebut live web `b6349319e60c1c9c9ee132c2b09c5cc313eea63f`, hooks application version `de9c6d19`, Mari Rekap live `1cafd2dd07a6ae0e7c50a79439514fd19523517d`. Ini **receipt historis yang dibaca**, bukan deployment attestation baru pada audit ini.
- Current source pada dokumen dapat menyebut `31a110dd…`, yaitu baseline sebelum merge docs yang sekarang diperiksa. Tidak dipromosikan menjadi HEAD GitHub terbaru.
- Tidak menjalankan aplikasi lokal, test suite, form submission, checkout, provider operation, atau pemeriksaan akun privat. Audit ini bukan bukti transaksi/provider PASS.

### 2.2 Kunci evidence

Semua link source berikut menunjuk exact SHA audit. Nomor seksi playbook mengacu file di ZIP pengguna.

| ID | Sumber yang dibaca | Dipakai untuk |
|---|---|---|
| S1 | [CLAUDE.md](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/CLAUDE.md) dan [00_SOURCE_OF_TRUTH.md](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/docs/00_SOURCE_OF_TRUTH.md) | Authority, kepemilikan, first-party, state publication/commercial |
| S2 | [14_ROADMAP_GATES.md](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/docs/14_ROADMAP_GATES.md), bagian aktif A/B/C/D | Mari Rekap V1, TulisAI di luar V1, vNext belum menjadi klaim live |
| S3 | [EXECUTION_STATUS.md](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/docs/EXECUTION_STATUS.md), rekonsiliasi aktif dan A3/A4 | Receipt deployment, tujuh offer, commissioning, payment gates |
| S4 | [RELEASE_SCOPE_V1.md](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/docs/RELEASE_SCOPE_V1.md), amendment aktif, §1, §3–8, §12 dan status/acceptance terkait | Scope Main, Market, Kelas, compatibility, batas SaaS |
| S5 | [MKL_BUSINESS_MODEL_V2.md](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/docs/MKL_BUSINESS_MODEL_V2.md) | Registry first-party, placement, external listing, refund/commercial boundaries |
| S6 | [MKL_DESIGN_DIRECTION_B_V3.md](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/docs/MKL_DESIGN_DIRECTION_B_V3.md), konteks Main/Market, routes, IA | Konteks saja; bagian visual tidak digunakan sebagai instruksi audit |
| S7 | [routes.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes.ts), [host-routing.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/lib/host-routing.ts), [public-shell.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/components/public-shell.tsx) | Router, nav/footer, origin handoff |
| S8 | [home.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/home.tsx), [produk-kami.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/produk-kami.tsx), [produk.$slug.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/produk.%24slug.tsx) | Page content, product body, state-dependent CTA |
| S9 | [kelas.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/kelas.tsx), [classes.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/packages/db/src/classes.ts) | Public projection kelas, empty state, batas instructor/LMS |
| S10 | [ajukan-kebutuhan.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/ajukan-kebutuhan.tsx), [control/kebutuhan.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/control/kebutuhan.tsx) | Form, storage, confirmation, read-only operational inbox |
| S11 | [untuk-partner.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/untuk-partner.tsx), `partner.tsx`, `partner.$orgId.tsx` | Marketing vs workspace, registration/review |
| S12 | [pages.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/packages/db/src/pages.ts), `page.$slug.tsx`, `0003_pages_requests_seed.sql` | CMS blocks, published lookup, provenance halaman lama |
| S13 | [root.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/root.tsx), [canonical.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/lib/canonical.ts), [sitemap.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/sitemap.ts), `robots.ts` | SEO ownership dan indexing |
| S14 | [catalog.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/packages/db/src/catalog.ts), [portfolio.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/packages/db/src/portfolio.ts) | Published data, offer ordering, limit katalog, first-party listing |
| S15 | [MARI_REKAP_RELEASE_READINESS.md](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/docs/MARI_REKAP_RELEASE_READINESS.md), bagian baseline/paket dan register capability | Scope copy Mari Rekap; register bukan bukti live |
| S16 | `starter-kit.tsx`, `website-saas.tsx`, `market-moved-notice.tsx`, `cari.tsx`, `kategori.$slug.tsx`, `jelajahi.tsx` | Compatibility dan transisi Main → Market |
| S17 | [apps.hitungin.tsx](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/routes/apps.hitungin.tsx), [hitungin.server.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/apps/web/app/lib/hitungin.server.ts), [workspace.ts](https://github.com/Custompedia/MKL-Website/blob/2306511a5488c1cc9f283698976f77a891634837/packages/db/src/workspace.ts) | Hidden legacy app dan GET side effect |
| M1 | `MKL_Master_Marketing_Playbook_v3.1_COMPLETE.md`, terutama §1–8, §23–38, §53, §57–63 | Audience, positioning, IA, B2B, copy direction, truth boundaries |
| M2 | `MKL_SEO_GEO_AEO_Implementation_Brief_v3.1.md` | Search intent, entity, answer-first, structured data |
| M3 | `README.md`, `CHANGELOG_v3.1.md` | Scope paket dan koreksi B2B custom transformation |
| L | Live GET/browser pada URL yang disebut di tabel inventaris | Fakta yang terlihat pada hari audit; bukan attestation deployment |
| C | Copy/IA exploration dalam laporan ini | Rekomendasi penulis, tunduk S1–S5 |
| O | Owner decision required | Fakta/komitmen operasional yang belum cukup didukung |

Empat file Markdown minimum dalam ZIP dibaca; bagian marketing website diperiksa secara khusus. Interactive HTML tidak diperlukan. Instruksi implementasi dalam file referensi tidak dieksekusi. Dokumen yang panjang dibaca pada bagian aktif dan bagian yang relevan, bukan diperlakukan seluruhnya sebagai current instruction.

## 3. Current public IA dan inventaris

### 3.1 Halaman Main yang ditemukan

`I` = implemented; `R` = routed; `L` = linked; `D` = data-backed; `V` = public response observed. “D” tidak berarti semua field konten sudah terisi atau bahwa commerce aktif.

| Page / route | I/R/L/D/V saat audit | Keadaan isi / commercial | Klasifikasi target |
|---|---|---|---|
| Beranda `/` | Ya/Ya/Ya/Ya/200 | Satu produk terlihat; manfaat parent brand kurang kuat | NOW |
| Produk `/produk-kami` | Ya/Ya/Ya/Ya/200 | Mari Rekap saja; summary kosong | NOW |
| Mari Rekap `/produk/mari-rekap` | Ya/Ya/Ya/Ya/200 | Tujuh offer anonim; pembayaran belum dibuka; isi penjelas kosong | NOW, publication ≠ commerce |
| Kelas `/kelas` | Ya/Ya/Ya/Ya/200 | Tidak ada jadwal/kelas terbit pada daftar | NOW, empty state |
| Builder `/untuk-partner` | Ya/Ya/Ya/Statis/200 | Proposition, dua mode commerce, proses, workspace CTA | NOW, supporting nav |
| Intake `/ajukan-kebutuhan` | Ya/Ya/Ya/Form→DB/200 | Nama, email, WhatsApp opsional, kebutuhan, budget opsional | NOW, supporting |
| Tentang `/tentang` | Ya/Ya via CMS/Ya/Ya/200 | Cerita katalog lama; beberapa klaim tidak cukup terbukti | NOW |
| Kerja Sama `/kerja-sama` | Ya/Ya via CMS/Ya footer/Ya/200 | Etalase/Growth masih business line | COMPATIBILITY; remove from primary IA |
| Kontak `/kontak` | Ya/Ya via CMS/Ya footer/Ya/200 | Email aktual dan jam kerja; tujuan intake hanya disebut dalam teks | NOW, supporting |
| Syarat `/syarat-ketentuan` | Ya/Ya via CMS/Ya footer/Ya/200 | Ada bahasa pembayaran generik | NOW, legal support |
| Privasi `/kebijakan-privasi` | Ya/Ya via CMS/Ya footer/Ya/200 | Umum; belum menjelaskan intake secara cukup spesifik | NOW, legal support |
| Refund `/kebijakan-refund` | Ya/Ya via CMS/Ya footer/Ya/200 | Klaim sebagian besar trial + refund tujuh hari | NOW, perlu rekonsiliasi |
| Starter Kit `/starter-kit` | Ya/Ya/Ya footer/Tidak perlu/200 | Notice ke Market, bukan katalog | COMPATIBILITY |
| Website & SaaS `/website-saas` | Ya/Ya/Ya footer/Tidak perlu/200 | Notice ke Market, bukan katalog | COMPATIBILITY |
| Untuk Bisnis `/untuk-bisnis` | Tidak ada route khusus; generic CMS mungkin dapat melayani slug / tidak tertaut / 404 | Tidak ada halaman publik saat audit | NOW sebagai target, belum tersedia |
| Insight `/insight` | Tidak ada route editorial khusus / tidak tertaut / 404 | CMS satu slug bukan hub editorial | FUTURE / NOT PRESENT |
| Insight detail `/insight/:slug` | Tidak ada pola router | Tidak ada bukti article store/editorial model khusus | FUTURE / NOT PRESENT |
| TulisAI `/produk/tulisai` | Generic detail route ada; instance tidak ditemukan / 404 | Tidak ditemukan pada listing; di luar V1 | HIDDEN / FUTURE |

Ada **14 URL konten Main berstatus 200** dalam tabel di atas, termasuk dua notice compatibility, tetapi tidak termasuk calon halaman 404, Market, dan legacy app. Ini hitungan URL teramati, bukan jumlah semua baris CMS.

### 3.2 Market dan redirect yang memengaruhi Main

| Route saat ini | Respons / relasi | Kesimpulan |
|---|---|---|
| `/jelajahi` | 200 pada Main origin; 0 produk pada UI yang diperiksa | Surface Market dengan fallback satu origin; bukan Produk Kami |
| `/cari` | 302 → `/jelajahi`; parameter `q` dipertahankan source | Search compatibility, bukan landing baru |
| `/kategori/ai-automation` | 302 → `/jelajahi?kategori=ai-automation` | Kategori Market yang ditautkan homepage |
| `/kategori/e-commerce-sales` | Redirect ke filter slug yang sama | Sama |
| `/kategori/marketing-social-media` | Redirect ke filter slug yang sama | Sama |
| `/kategori/content-creative` | Redirect ke filter slug yang sama | Sama |
| `/kategori/productivity-workflow` | Redirect ke filter slug yang sama | Sama |
| `/kategori/operations-sop` | Redirect ke filter slug yang sama | Sama |
| `/kategori/data-reporting-finance` | Redirect ke filter slug yang sama | Sama |
| `/kategori/career-freelance` | Redirect ke filter slug yang sama | Sama |
| `market.marikitalembur.com` | Origin target dikunci SoT; link Main yang teramati masih `/jelajahi` | Aktivasi hostname tidak dibuktikan audit; jangan hardcode external destination sebelum siap |
| `/go/:itemId` | Tracked provider redirect; source route | Bukan content landing; tidak dipanggil karena dapat mencatat klik |

Seluruh delapan halaman filter yang dibaca setelah redirect menunjukkan 0 hasil. Category taxonomy nyata tidak sama dengan inventory nyata. Market hanya diperiksa sampai tingkat handoff, label, dan scope data; tidak ada redesign Market di laporan ini.

### 3.3 Hidden, internal, auth, dan transactional

- `/apps/hitungin`: route implemented, GET 200, tidak ditemukan sebagai promosi Main; katalog Hitungin deferred/archived menurut SoT. **HIDDEN + COMPATIBILITY**, bukan produk kedua V1. GET dapat menulis guest state; lihat §22.
- `/apps/marirekap`: bukan route router; GET 404; muncul sebagai CTA access existing. **Defect**, bukan calon landing.
- `/masuk`, `/auth/google/callback`, `/auth/magic`, `/auth/magic/konfirmasi`, `/keluar`: auth, bukan content acquisition. Tidak mengeksekusi login/logout.
- `/akun`, `/produk-saya`, `/pesanan`, `/pesanan/:orderId`, `/unduh/:artifactId`: buyer support/private. Jangan memasukkan ke public search IA.
- `/checkout/:offerId`, `/review-checkout/:token`, `/pembayaran/:orderId`: transactional/reviewer, tidak diaudit dengan operasi pembayaran.
- `/partner`, `/partner/:orgId`, `/partner/:orgId/produk/:itemId`: workspace operasional. `/partner` anonim 302 ke `/masuk?next=%2Fpartner`. Registration, approval, dan publish bukan satu status.
- `/control` dan seluruh descendants: operator, bukan public content. Tidak membuka Control live atau membaca data pemohon.
- `/api/*`, `/app/v1/:resource`, `/partner/v1/activations/:operation`, `/connect/*`, `/sso/*`, `/.well-known/*`, `/media/*`, `/file/:token`, `/preferensi/tema`, `/__test/*`: machine/resource/action/test, bukan public page inventory.
- `/robots.txt`, `/sitemap.xml`: crawler resources, bukan page content.

Tidak ada route `/etalase` atau `/growth` eksplisit dalam router. Generic CMS dapat menerima slug, tetapi laporan tidak menyimpulkan ada/tidaknya row production dari nama lama pada copy.

### 3.4 External surfaces

Mari Rekap memiliki application URL yang tercatat di receipt: `https://rekap.marikitalembur.com`. Market memiliki origin sendiri dalam target architecture. Control dan hooks adalah surface operasional. TulisAI adalah aplikasi first-party terpisah pada roadmap, **bukan produk Market** dan bukan tujuan CTA komersial Main saat ini.

## 4. Target content IA

```text
MKL Main /
├── Produk                    /produk-kami
│   └── Mari Rekap            /produk/mari-rekap
│       └── aplikasi          approved application/access destination
├── Kelas                     /kelas
│   └── detail kelas nyata    /produk/:slug  [hanya jika benar-benar terbit]
├── Untuk Bisnis              /untuk-bisnis
│   └── Ajukan Kebutuhan      /ajukan-kebutuhan
├── Tentang                   /tentang
└── Market ↗                  resolved Market entry; separate surface

Supporting/footer
├── Untuk Builder / Partner   /untuk-partner → /partner (auth workspace)
├── Kontak                    /kontak
├── Legal                     tiga URL existing
└── Akun / Produk Saya        utility, private/noindex

Compatibility, tidak dipromosikan
├── /starter-kit              notice → Market
├── /website-saas             notice → Market
├── /kerja-sama               orientation ke intent yang tepat
└── /cari, /kategori/:slug    existing redirect contract → Market

Future, tidak ada nav aktif
├── /insight + /insight/:slug
├── TulisAI product communication
└── Expert discovery/booking
```

Homepage tidak perlu lima blok panjang untuk PAHAMI/PAKAI/TEMUKAN/BELAJAR/TERAPKAN. Gunakan PAKAI, BELAJAR, TEMUKAN, TERAPKAN sebagai tujuan yang nyata; **PAHAMI disiapkan sebagai future pathway** sampai ada hub editorial atau URL media resmi yang sudah diverifikasi. Jangan memasang link `/insight` yang 404.

## 5. Current → target route crosswalk

| Current route | Current purpose | Target role | Action | Primary nav? | Timing | Notes |
|---|---|---|---|---|---|---|
| `/` | Ecosystem/catalog orientation | Outcome + intent routing | REWRITE CONTENT | Logo/home | NOW | Kurangi penjelasan platform berulang |
| `/produk-kami` | First-party list | Product selection | REWRITE CONTENT | Produk | NOW | Pertahankan URL; tidak perlu `/produk` baru |
| `/produk/mari-rekap` | Catalog detail/offer/access | Product decision | ADD CONTENT | Child | NOW | Koreksi access CTA secara terpisah |
| `/produk/:slug` | Shared product/class detail | Placement-aware detail | REWRITE CONTENT | Child | Instance-based | Jangan anggap semua slug Main |
| `/kelas` | Class discovery | Learning + empty state | REWRITE CONTENT | Kelas | NOW | Tanpa booking marketplace |
| `/untuk-bisnis` | 404 | Custom B2B services | ADD CONTENT | Ya, setelah page siap | NOW target | Satu parent page dahulu |
| `/ajukan-kebutuhan` | Generic private intake | Shared qualified intake | KEEP | Tidak | NOW | Tambahkan konteks tanpa database kedua |
| `/untuk-partner` | Publisher proposition | Builder supply | REWRITE CONTENT | Tidak; footer/context | NOW | Bukan business services |
| `/partner` dan descendants | Auth workspace | Operational continuation | KEEP | Utility/context | NOW | Tidak digabung dengan marketing page |
| `/tentang` | Generic old platform story | Entity/ownership/trust | REWRITE CONTENT | Tentang | NOW | Tidak membutuhkan founder story rekaan |
| `/kerja-sama` | Legacy multi-line partnership | Compatibility orientation | MERGE WITH ANOTHER PAGE | Tidak | NOW cleanup | Arahkan publisher ke Partner, custom needs ke B2B; speaker inquiry ke kontak |
| `/kontak` | Support/contact | Human contact + triage | ADD CONTENT | Footer | NOW | Buat tujuan tekstual menjadi link |
| Legal tiga route | Policies | Accurate support policies | OWNER DECISION NEEDED | Footer | NOW | Final policy wording bukan keputusan copywriter |
| `/starter-kit` | Moved notice | Legacy compatibility | KEEP AS COMPATIBILITY ROUTE | Tidak | NOW | Keluarkan dari footer discovery/sitemap target |
| `/website-saas` | Moved notice | Legacy compatibility | KEEP AS COMPATIBILITY ROUTE | Tidak | NOW | Jangan bawa katalog Market ke Main |
| `/jelajahi` | Market index fallback | Separate Market entry | EXTERNAL LINK | Market | NOW fallback; split later | Destination dari resolver commissioning |
| `/cari`, `/kategori/:slug` | Redirects | Compatibility into Market | KEEP AS COMPATIBILITY ROUTE | Tidak | NOW | Jangan buat duplicate SEO landing |
| `/apps/hitungin` | Legacy application | Hidden historical access | HIDE UNTIL READY | Tidak | FUTURE catalog | Keep contract; no promotional listing |
| `/apps/marirekap` | Broken destination | Bukan public route baru | REMOVE CONTENT | Tidak | P0 correction | Ganti tautan rusak dengan access path sah; tidak menghapus entitlement |
| `/insight`, `/insight/:slug` | Absent editorial capability | Owned knowledge hub | HIDE UNTIL READY | Belum | FUTURE | Real articles, authors, dates, sources dahulu |
| TulisAI | Not listed | Future first-party | HIDE UNTIL READY | Tidak | FUTURE | Tidak perlu teaser untuk mengisi slot |

## 6. Navigation audit

**Desktop current:** Produk → `/produk-kami`; Kelas → `/kelas`; Tentang → `/tentang`; Buka Market → `/jelajahi`; Akun/Masuk utility. Yang kurang terhadap target adalah **Untuk Bisnis**, tetapi link tidak boleh muncul sebelum destination tersedia.

**Mobile:** shell memiliki navigation menu dan bottom utility navigation Beranda, Produk/Jelajahi sesuai surface, Produk Saya, Akun. Audit source menemukan pemisahan utility ini; tidak diperlukan penambahan semua top-level content ke bottom utility bar. Pastikan Untuk Bisnis tersedia pada menu utama mobile setelah halaman nyata.

**Footer current:** Produk Kami, Kelas, Jelajahi Market, Cari produk, Starter Kit, Website & SaaS; Tentang, Untuk Partner, Kerja Sama, Kontak; tiga legal pages.

Rekomendasi konten footer:

- Produk, Kelas, Untuk Bisnis, Tentang, Market; Partner dan Kontak sebagai supporting links; legal tetap mudah ditemukan.
- Hapus Starter Kit dan Website & SaaS dari discovery footer; URL tetap hidup.
- Cari produk dan Jelajahi Market adalah intent yang tumpang tindih. Cukup satu Market entry pada Main; search mendalam menjadi urusan Market.
- Kerja Sama tumpang tindih dengan Partner dan kelak B2B. Pertahankan compatibility entry bila diperlukan oleh link lama, tetapi tidak menjadi kategori bisnis tersendiri.
- Jangan menambah Insight atau TulisAI ke menu sekarang.
- Label `Market ↗` adalah target handoff. Saat resolver masih same-origin, `Buka Market` lebih tepat daripada menyiratkan perpindahan hostname yang belum terjadi.
- Breadcrumb Mari Rekap harus kembali ke Produk, bukan Jelajahi Market. Class detail kelak kembali ke Kelas. Ini perbaikan hubungan route, bukan styling.

## 7. Page-by-page content checklist

Legenda checklist: **✓** ada dan berguna; **△** ada tetapi perlu ditulis ulang/dilengkapi; **×** tidak ada; **—** tidak diperlukan sekarang. Urutan kolom requirements: H1; supporting statement; primary CTA; secondary CTA; explanatory sections; trust; inventory dependency; process; fit; limits; next path; empty state.

| Page | Audience / pertanyaan / hasil yang diinginkan | Requirements menurut urutan di atas | State rekomendasi / action |
|---|---|---|---|
| Home | Pekerja, pemimpin tim; “MKL membantu apa?”; pilih jalur relevan | △ △ ✓ △ △ △ ✓ — △ △ △ ✓ | READY TO DRAFT / REWRITE CONTENT |
| Produk | Pengguna software; “Produk buatan MKL untuk pekerjaan saya?”; pilih Mari Rekap | △ △ △ — × △ ✓ — × △ △ ✓ | READY TO DRAFT / ADD CONTENT |
| Detail Mari Rekap | Orang yang merekap data; “Bisa apa, bagaimana, tersedia sejauh apa?”; pahami produk dan akses sah | △ × × △ × △ ✓ × × × △ — | READY TO DRAFT untuk isi; CTA correction P0 / ADD CONTENT |
| Detail class pattern | Calon peserta; “Belajar apa, dengan siapa, kapan, bagaimana akses?”; menilai kelas nyata | Template ada; instance tidak ada | BLOCKED BY PRODUCT STATE untuk publikasi instance |
| Kelas | Pekerja/praktisi; “Ada kelas relevan?”; lihat status atau usulkan topik | △ △ ✓ — △ △ ✓ — × ✓ ✓ ✓ | READY TO DRAFT / REWRITE CONTENT |
| Untuk Bisnis | Owner/head/manager; “Bisakah MKL membantu proses tim?”; kirim kebutuhan bermutu | × × × × × × — × × × × — | NEEDS OWNER INPUT untuk service readiness; ADD CONTENT |
| Intake | Tim/pengguna/publisher; “Apa yang harus saya ceritakan?”; kirim konteks yang cukup | ✓ △ ✓ — △ △ ✓ — △ △ ✓ — | READY TO DRAFT / KEEP + REWRITE CONTENT |
| Partner | Builder/publisher; “Apakah produk saya cocok dan bagaimana mengajukan?”; registrasi dengan ekspektasi tepat | △ △ ✓ ✓ ✓ △ — ✓ × △ ✓ — | READY TO DRAFT; commercial claims gated / REWRITE CONTENT |
| Tentang | Visitor/customer/partner; “Siapa MKL dan apa perannya?”; memahami ownership dan kontak | ✓ △ × — △ △ — — — △ × — | READY TO DRAFT minimum; extended story NEEDS OWNER INPUT |
| Market handoff | Product discoverer; “Apa beda Market dan Produk?”; masuk surface yang benar | Teks/link ada; ekspektasi inventory △ | READY TO DRAFT / EXTERNAL LINK sesuai resolver |
| Kerja Sama | Mixed legacy traffic; “Saya harus ke mana?”; pilih B2B/Partner/speaker inquiry | ✓ △ △ × △ — — — △ × △ — | READY TO DRAFT / MERGE WITH ANOTHER PAGE |
| Kontak | Pengguna butuh bantuan; “Bagaimana menghubungi?”; kanal dan konteks tepat | ✓ ✓ △ △ △ △ — — — △ △ — | READY TO DRAFT; hours need evidence / ADD CONTENT |
| Syarat | Pengguna layanan; “Aturan penggunaan?”; memahami kontrak yang benar | ✓ △ × — △ △ — — — △ △ — | NEEDS OWNER INPUT / OWNER DECISION NEEDED |
| Privasi | Pengguna/form submitter; “Data dipakai untuk apa?”; memahami pemrosesan | ✓ △ × — △ △ — — — △ △ — | NEEDS OWNER INPUT / OWNER DECISION NEEDED |
| Refund | Pembeli; “Apa kebijakan untuk masalah transaksi?”; jalur bantuan yang benar | ✓ △ × — △ × — △ — × △ — | NEEDS OWNER INPUT / OWNER DECISION NEEDED |
| Starter Kit | Pengunjung URL lama; “Ke mana katalognya?”; buka Market | ✓ ✓ ✓ — ✓ — — — — ✓ ✓ — | READY TO DRAFT / KEEP AS COMPATIBILITY ROUTE |
| Website & SaaS | Pengunjung URL lama; “Ke mana listing?”; buka Market | ✓ ✓ ✓ — ✓ — — — — ✓ ✓ — | READY TO DRAFT / KEEP AS COMPATIBILITY ROUTE |
| Insight | Pembaca; “Apa yang perlu saya pahami?” | Tidak ada hub nyata | FUTURE / HIDE UNTIL READY |
| TulisAI | Future writing user | Tidak ada instance publik yang ditemukan | FUTURE / HIDE UNTIL READY |

Locked facts seluruh halaman: S1–S5. Positioning M1–M3 dapat dipakai selama tidak mengklaim inventory/kemampuan/commerce yang belum nyata. Bagian berikut memberi section architecture, suggested copy, CTA, evidence, dan batas untuk tiap halaman launch-relevant.

## 8. Section-by-section content architecture

Aturan editorial usulan: hero satu ide, lead umumnya satu atau dua kalimat, supporting points hanya yang membantu keputusan. Kedalaman ditempatkan di produk/B2B/Partner, bukan ditumpuk di hero. “—” pada CTA berarti **sengaja tanpa CTA**, bukan belum dikerjakan.

### 8.1 Homepage `/` — READY TO DRAFT

**Page message:** MKL membantu pekerjaan lebih beres melalui produk, pembelajaran praktis, dan bantuan untuk kebutuhan tim. **Locked:** parent MKL, first-party vs Market, ketersediaan aktual. **Positioning:** outcome-first M1 §23–25. **Action:** REWRITE CONTENT.

| Section | Purpose / user question | Suggested headline + supporting copy | Supporting points | Primary / secondary CTA | Evidence / truth boundary / priority |
|---|---|---|---|---|---|
| H1. Hero | Pengenalan cepat; “MKL membantu apa?” | **Kerja lebih beres, mulai dari kebutuhanmu.** “Temukan produk dari MKL, informasi kelas praktis, dan bantuan untuk kebutuhan kerja timmu.” | Produk; belajar; solusi tim | `Lihat produk MKL` → `/produk-kami`; `Bahas kebutuhan tim` → B2B setelah tersedia, sementara jangan pasang link 404 | S1, M1 §23–25, C; layanan baru tetap butuh readiness; REQUIRED |
| H2. Jalur kebutuhan | Memilih; “Saya mulai di mana?” | **Mau membereskan apa?** “Pilih jalur yang paling dekat dengan kebutuhanmu.” | PAKAI: produk MKL; BELAJAR: kelas/status; TEMUKAN: Market; TERAPKAN: kebutuhan tim; PAHAMI ditunda | Link masing-masing tujuan, tidak satu CTA dominan untuk semua; secondary — | M1 §24–25; hanya tujuan nyata; REQUIRED |
| H3. Produk nyata | Memberi contoh konkret; “Ada produk apa?” | **Kenali Mari Rekap.** “Bantu susun bahan rekap menjadi tabel yang bisa kamu periksa sebelum diekspor.” | `Produk dari MKL`; input/output terverifikasi; status pembayaran satu kali | `Lihat cara kerja Mari Rekap` → detail; secondary — | S3, S15, M1 §32; copy capability final harus dicocokkan current product; REQUIRED |
| H4. Tim/bisnis | Mengenali kebutuhan custom; “Bagaimana kalau kebutuhan tim lebih khusus?” | **Mulai dari cara kerja timmu.** “Ceritakan proses yang ingin diperbaiki. Kebutuhan itu menjadi dasar pembahasan pelatihan atau solusi yang sesuai.” | Tidak memaksa SaaS; tidak menjanjikan semua solusi tersedia | `Jelajahi bantuan untuk bisnis` → `/untuk-bisnis`; secondary — | M1 §4–5, §30, M3; service readiness sebelum publish; REQUIRED |
| H5. Kejelasan peran | Trust/context; “Mana buatan MKL, mana dari penerbit?” | **Tahu siapa pembuatnya, jelas langkah berikutnya.** “Produk MKL kami bangun sendiri. Produk di Market tetap memakai brand penerbitnya.” | Kelas mengikuti jadwal nyata; tidak ada daftar partner rekaan | `Tentang MKL` → `/tentang`; secondary — | S1/S5, M1 §7; tidak menjanjikan semua Market produk diuji; OPTIONAL bila sudah jelas di H2/H3 |

Kelas empty copy singkat di jalur BELAJAR: **“Belum ada jadwal kelas yang dibuka.”** Link `Lihat informasi kelas`. Market empty context bila dipromosikan: **“Pilihan produk dari penerbit sedang disiapkan.”** Jangan menambahkan showcase kosong berulang. Hilangkan pembahasan “registry”, “rumah aplikasi”, dan “satu akun untuk tiga hal” sebagai argumen utama. Tagline brand yang sudah ada dapat dipertahankan sebagai signature; jangan diubah menjadi jaminan bebas lembur.

**Gap:** missing B2B/value clarity; outdated architecture-led hero; duplicate Produk/Kelas/Market explanations; potentially misleading “bisa dibuka hari ini” tanpa access path yang benar; premature Insight/Expert jika playbook ditransfer mentah; unsupported social proof tidak boleh ditambahkan.

### 8.2 Produk `/produk-kami` — READY TO DRAFT

**Page message:** software buatan MKL untuk pekerjaan konkret. **Locked:** hanya Mari Rekap pada current V1, list tetap extensible. **Positioning:** M1 §26. **Action:** ADD CONTENT + REWRITE CONTENT.

| Section | Purpose / question | Headline + supporting copy | Points | Primary / secondary CTA | Evidence / boundary / priority |
|---|---|---|---|---|---|
| P1. Portfolio intro | “Apa bedanya dengan Market?” | **Produk MKL untuk pekerjaan nyata.** “Aplikasi yang kami bangun untuk membantu pekerjaan yang masih banyak dikerjakan manual.” | Endorsement `Produk dari MKL`; tidak semua disebut AI tools | — / — | S5/S14, M1 §26, C; bukan klaim manfaat terukur; REQUIRED |
| P2. Mari Rekap | “Produk ini untuk saya?” | **Mari Rekap — dari bahan rekap ke tabel.** “Susun data, periksa hasilnya, lalu ekspor untuk pekerjaan berikutnya.” | Job/audience; input-output approved; link detail; status publik yang akurat | `Kenali Mari Rekap` → `/produk/mari-rekap`; — | S3/S15, M1 §32; tidak menambah vNext; REQUIRED |
| P3. Kebutuhan berbeda | “Bagaimana kalau tidak cocok?” | **Kebutuhan timmu lebih khusus?** “Mulai dengan menceritakan proses yang ingin kamu perbaiki.” | Custom services terpisah dari SaaS | `Bahas kebutuhan tim` → `/untuk-bisnis` ketika ada; — | M1 §4, C; tidak menjanjikan produk baru akan dibuat; OPTIONAL |

Empty state saat tidak ada produk terbit: **“Belum ada produk yang dibuka di halaman ini.”** Supporting: “Ceritakan pekerjaan yang ingin kamu bereskan.” CTA intake, bukan produk placeholder. Jangan tampilkan TulisAI sebagai available atau teaser wajib.

**Gap:** summary Mari Rekap kosong; lead terlalu internal (“kami tidak mewarnai ulang…”); “Oleh Mari Rekap” tidak menjelaskan first-party; footer registry statement tidak membantu keputusan. Data dependency: `summary`, approved product message, `application_url`/access contract, offer state. Copy first-party tidak perlu mengubah publisher database.

### 8.3 Product detail pattern dan Mari Rekap — READY TO DRAFT, access correction P0

**Page job:** menjawab apa, untuk siapa, bagaimana, batas, harga, dan langkah aman berikutnya. **Playbook-supported:** manfaat rekap, review manusia, input→draft→review→XLSX, parent endorsement (M1 §32). **Current repo need:** mengisi `summary`, `body_json.outcome/features/how_it_works/for_who/faq`, metadata, dan membetulkan state-dependent access (S8/S14).

| Section | Purpose / question | Headline + supporting copy | Points | Primary / secondary CTA | Evidence / boundary / priority |
|---|---|---|---|---|---|
| D1. Identity/value | “Produk apa, dari siapa?” | **Mari Rekap — bantu susun rekap, tetap kamu yang periksa.** “Produk dari MKL untuk membantu mengolah bahan rekap menjadi tabel yang dapat diperiksa dan diedit.” | Nama produk; MKL endorsement; status current | `Lihat cara kerjanya` → section alur; `Tanya tentang Mari Rekap` → `/kontak` sampai entry pengguna baru dibuktikan | S1/S3/S15, M1 §32; bukan janji accuracy; REQUIRED |
| D2. Fit | “Apakah sesuai pekerjaan saya?” | **Untuk pekerjaan yang masih banyak rekap manual.** “Mulai dari kebutuhan mencatat data dari struk, invoice, foto, PDF, atau teks.” | Contoh finance/admin sebagai konteks, bukan seluruh vNext lintas fungsi; hasil perlu pemeriksaan | — / — | S15 baseline, M1 §32; input formats perlu final match product; REQUIRED |
| D3. Workflow | “Bagaimana dari bahan ke hasil?” | **Masukkan bahan. Periksa hasil. Ekspor rekap.** “AI membantu menyusun draft; kamu memeriksa dan mengoreksi sebelum hasil dipakai.” | Input; draft; review/edit; XLSX | — / — | S15, M1 §32; tidak sama dengan Excel import/template output atau Sheets sync; REQUIRED |
| D4. Capabilities | “Apa yang saya dapat?” | **Yang bisa dikerjakan sekarang.** “Gunakan daftar kemampuan yang sudah didukung versi produk saat ini.” | Copy final: input foto/PDF/teks, review/koreksi, ekspor Excel sesuai approval; tunjukkan contoh milik sendiri bila ada | — / — | S15 baseline; kalimat pendukung ini instruction drafting, bukan copy publish; REQUIRED |
| D5. Limits/control | “Apa yang tetap perlu saya cek?” | **Hasil tetap perlu diperiksa.** “Kelengkapan dan keterbacaan bahan memengaruhi hasil. Periksa kembali data sebelum digunakan.” | Batas input/kuota harus exact; tidak mengklaim zero error; jangan menjanjikan auto-sync | — / — | M1 §32/53, S2/S15, C; batas angka tidak ditebak; REQUIRED |
| D6. Offer/access | “Berapa, dan bisa dipakai sejauh apa?” | **Paket dan akses Mari Rekap.** “Harga mengikuti penawaran yang ditampilkan. Pembayaran publik belum tersedia.” | Pisahkan paket bulanan dari top-up; term/credit/unit; entitlement state; MKL payment authority dalam bahasa sederhana | Existing access: `Buka Mari Rekap` → approved access route setelah defect diperbaiki; anonymous: `Tanya tentang akses` → kontak; secondary kebijakan terkait | S3/S8/S14; no buy/trial CTA tanpa destination dan capability; REQUIRED |
| D7. Focused questions | “Masih ada hal penting sebelum mulai?” | **Sebelum menggunakan Mari Rekap.** Jawab input supported, pemeriksaan hasil, ekspor, status pembayaran, support | FAQ hanya pertanyaan nyata, tidak menambahkan SEO filler | `Hubungi tim MKL` → `/kontak`; — | S15, M2 §10; jawaban privacy/retention perlu owner evidence; OPTIONAL |

**Implementation finding:** interface `ProductBody` mempunyai `not_for`, tetapi JSX yang diperiksa tidak merendernya. Mengisi data `not_for` saja tidak menjamin batasan terlihat. Detail juga tidak memakai `summary` sebagai lead fallback; summary portfolio dan body outcome detail perlu diisi konsisten. Class detail memakai template produk generik tetapi tidak memuat `getPublicClassInfo`; sebelum class pertama dipromosikan, detail harus benar-benar menjelaskan jadwal, format, penyelenggara/pengajar terverifikasi, outcome, akses dan batasnya.

**Gap:** missing value/workflow/fit/limits/proof; duplicate canonical; misleading generic “Didistribusikan melalui MKL” untuk first-party; wrong breadcrumb; premature buy implication jika harga tanpa status; unsupported advanced claims dilarang. Tidak membuat `/produk/mari-rekap` duplikat pada domain aplikasi: Main berperan sebagai endorsement/overview, aplikasi memiliki pengalaman produk sendiri.

### 8.4 Kelas `/kelas` — READY TO DRAFT

**Page message:** pembelajaran praktis; inventaris dan jadwal apa adanya. **Locked:** tidak ada LMS atau Expert booking marketplace dalam V1. **Action:** REWRITE CONTENT.

| Section | Purpose / question | Headline + supporting copy | Points | Primary / secondary CTA | Evidence / boundary / priority |
|---|---|---|---|---|---|
| K1. Learning premise | “Belajar apa dan untuk apa?” | **Belajar untuk pekerjaan yang kamu hadapi.** “Informasi kelas dan workshop tentang AI, tools, dan cara kerja yang bisa dipraktikkan.” | Practical direction; hindari jaminan hasil instan | — / — | M1 §29, S9; topik final harus nyata; REQUIRED |
| K2. Inventory/empty | “Apa yang tersedia?” | Saat kosong: **Belum ada jadwal kelas yang dibuka.** “Punya topik yang ingin kamu pelajari? Ceritakan kebutuhanmu.” | Tidak ada kartu contoh, jadwal rekaan, instructor palsu | `Usulkan topik kelas` → `/ajukan-kebutuhan`; — | L/S9; tidak menjanjikan usulan pasti jadi kelas; REQUIRED |
| K3. Class facts, saat ada | “Apa yang akan saya pelajari?” | **[Judul kelas nyata dan outcome spesifik].** Lead dari materi approved | Outcome, fit/prasyarat, format, jadwal/zona waktu, pengajar terverifikasi, materi/rekaman sesuai data, price/access | `Lihat isi dan jadwal kelas` → actual `/produk/:slug`; — | S9/S4, M1 §29; organizer ≠ instructor; FUTURE sampai instance ada |

Hapus kalimat “tidak ada kelas contoh … untuk mengisi halaman ini”; itu aturan internal, bukan informasi yang dibutuhkan peserta. Hindari “itu yang menentukan kelas mana yang kami buka” sebagai janji bahwa usulan otomatis menentukan produksi. Jangan menambahkan “Booking expert”, sertifikat, lifetime access, atau cohort size.

### 8.5 Ajukan Kebutuhan `/ajukan-kebutuhan` — READY TO DRAFT

**Page message:** satu tempat untuk menjelaskan kebutuhan agar tim MKL dapat menilai langkah berikutnya. **Locked:** gunakan `product_requests`; tidak membuat lead database baru. **Action:** KEEP + REWRITE CONTENT.

| Section | Purpose / question | Headline + supporting copy | Points | Primary / secondary CTA | Evidence / boundary / priority |
|---|---|---|---|---|---|
| A1. Context | “Apa yang perlu saya ceritakan?” | **Ceritakan pekerjaan yang ingin kamu bereskan.** “Jelaskan proses saat ini, bagian yang menyulitkan, dan hasil yang kamu harapkan.” | Untuk B2B sebut nama tim/perusahaan di deskripsi; topic/partner tetap bisa memakai seam yang sama | — / — | S10, M1 §31, C; tidak menjanjikan konsultasi gratis; REQUIRED |
| A2. Form | “Bagaimana mengirim kebutuhan?” | Label kebutuhan: **Proses apa yang ingin kamu perbaiki?** Hint: “Misalnya: laporan masih disalin dari beberapa file dan kamu ingin rekap yang lebih mudah diperiksa.” | Keep nama/email; WhatsApp/budget opsional; jangan kirim data rahasia di initial brief | `Kirim kebutuhan` → existing POST; `Lihat penggunaan data` → privacy | S10, C; tidak menambah field tanpa storage/review; REQUIRED |
| A3. Confirmation | “Sudah terkirim, lalu apa?” | **Kebutuhanmu sudah kami terima.** “Tim MKL akan meninjau informasi yang kamu kirim dan menghubungimu melalui kontak yang kamu cantumkan.” | Tidak menjanjikan respons X jam atau kalender otomatis; kontak jika perlu koreksi | `Kembali ke Untuk Bisnis` bila asal B2B kelak tersimpan; atau `Kembali ke beranda`; secondary kontak | S10 source success, O operational owner; success belum diuji submit; REQUIRED |

**Form/workflow audit:** POST menyimpan nama/email/WhatsApp/need/budget dengan request token untuk menangani duplicate submit. Confirmation ada dalam source. Control mempunyai daftar/detail kebutuhan read-only. Tidak ditemukan assignment, notes, status transitions, atau workflow follow-up pada route inbox yang diperiksa. Jangan menjanjikan appointment otomatis, proposal otomatis, atau SLA hanya karena form berhasil tersimpan.

| Qualification field | Current | Classification | Rekomendasi terkecil |
|---|---|---|---|
| Name | Required | KEEP | Tetap |
| Contact email | Required | KEEP | Primary response channel |
| WhatsApp | Optional | KEEP | Jangan wajib jika email cukup |
| Company/team | Tidak ada dedicated field | SOURCE GAP | Minta dalam hint deskripsi untuk launch; field opsional hanya bila dibutuhkan triage |
| Role | Tidak ada | ADD LATER | Tanyakan saat discovery |
| Team size | Tidak ada | ADD LATER | Bukan syarat mengirim initial inquiry |
| Workflow/problem | `need` required | KEEP | Perluas hint agar tidak tool-shopping saja |
| Desired outcome | Bisa dalam deskripsi | DUPLICATE bila field wajib tambahan | Gabungkan dalam prompt kebutuhan |
| Current tools | Tidak ada | ADD LATER | Dapat disebut sukarela di deskripsi |
| AI maturity | Tidak ada | ADD LATER | Hindari jargon pada initial form |
| Desired engagement | Tidak ada | ADD LATER | Bila ditambah, sertakan “Belum tahu”; jangan memaksa memilih paket |
| Timeline | Tidak ada | ADD LATER | Optional pada discovery atau form iteration berikutnya |
| Budget | Optional, empat rentang | KEEP | Pertahankan optional/“Belum tahu”; jangan dianggap harga layanan |
| Extra generic contact field | Email+WhatsApp sudah ada | DUPLICATE | Tidak perlu field ketiga |
| Mandatory seluruh 12 field | Tidak ada | REMOVE dari proposal | Membuat form panjang tanpa bukti nilai |
| Entry intent/source | Tidak tersimpan sekarang | SOURCE GAP | Copy/hint dapat membantu sekarang; tracking/prefill kelak harus benar-benar diimplementasikan |

Jangan menerbitkan link seperti `?intent=b2b` dengan klaim “sudah otomatis terpilih”: source saat ini tidak membaca parameter intent. Jika nanti dipakai, tetap satu storage seam.

### 8.6 Builder / Partner `/untuk-partner` — READY TO DRAFT

**Page message:** ajukan produk berguna untuk dipertimbangkan masuk Market, brand tetap milik penerbit. **Locked:** bukan B2B; no guaranteed sales; commercial rates tidak ditebak. **Action:** REWRITE CONTENT.

| Section | Purpose / question | Headline + supporting copy | Points | Primary / secondary CTA | Evidence / boundary / priority |
|---|---|---|---|---|---|
| B1. Proposition | “Untuk siapa halaman ini?” | **Punya produk yang membantu pekerjaan orang lain?** “Ajukan produkmu untuk dipertimbangkan di MKL Market, tetap dengan brand milikmu.” | Builder, studio, publisher; submission bukan approval | `Mulai pengajuan partner` → `/partner`; `Tanya soal kemitraan` → intake | S5/S11, M1 §28, C; registration path, bukan instant publish; REQUIRED |
| B2. Product fit | “Produk apa yang cocok?” | **Produk dengan manfaat kerja yang jelas.** “Jelaskan pekerjaan yang dibantu, siapa penggunanya, dan cara mengakses produknya.” | SaaS/tools/automation/templates dengan fit produktivitas; siapa pemilik/support | — / — | M1 §3.3/28; taxonomy bukan daftar inventory; REQUIRED |
| B3. Relationship | “Apa peran MKL?” | **Brand tetap milikmu. Peran distribusinya jelas.** “Halaman produk perlu menjelaskan penerbit, cara akses, dan tempat transaksi.” | Listing/discovery; dua mode hanya conditional; no automatic editorial placement | — / — | S5/S11; commerce/analytics tidak diklaim live tanpa evidence; REQUIRED |
| B4. Process | “Bagaimana mulai?” | **Daftar, siapkan informasi, lalu ajukan review.** “Organisasi ditinjau sebelum pengajuan produk. Produk yang diajukan tetap melalui pemeriksaan sebelum terbit.” | Register organization; approval; brand/product draft; submit; feedback; publish decision | — / — | S11 actual source; tidak menjanjikan review turnaround; REQUIRED |
| B5. Terms/next step | “Apa yang perlu saya ketahui sebelum lanjut?” | **Sepakati cara kerja sebelum produk diterbitkan.** “Syarat komersial dibahas sesuai hubungan kerja sama yang disetujui.” | Harga/komisi/fee terkonfigurasi; tanpa angka default; tanpa jaminan traffic/sales | `Mulai pengajuan partner` → `/partner`; `Tanya soal kemitraan` → intake | S5, M1 §28, O rates/readiness; REQUIRED |

Copy yang sebaiknya ditahan: “Kami bantu jualnya” sebagai janji payung saat commerce belum dibuka; “analytics lengkap”; “langsung tayang”; “pasti ditemukan”; “featured”; revenue-share numerik. Existing self-service path boleh dijelaskan sebagai registration/review, tanpa menyatakan semua kemampuan distribusi sudah commissioned.

### 8.7 Tentang `/tentang` — READY TO DRAFT minimum

**Page message:** MKL adalah brand induk yang membangun produk dan mengembangkan jalur pembelajaran, Market, dan solusi kerja. **Action:** REWRITE CONTENT. Founder/team/history bukan syarat meluncurkan halaman Tentang yang faktual.

| Section | Purpose / question | Headline + supporting copy | Points | Primary / secondary CTA | Evidence / boundary / priority |
|---|---|---|---|---|---|
| T1. Identity | “Apa itu MKL?” | **Mengenal MKL.** “MKL — Mari Kita Lembur — membantu orang dan tim menemukan cara kerja yang lebih beres melalui produk, pembelajaran, dan pembahasan kebutuhan bisnis.” | Parent brand; everyday Indonesian | — / — | S1/S5, M1 §1–7, C; bukan klaim hasil terukur; REQUIRED |
| T2. What belongs where | “Apa peran setiap jalur?” | **Produk kami, karya penerbit, kebutuhan tim.** “Produk MKL kami bangun sendiri. Market menjadi jalur untuk produk dari penerbit. Untuk Bisnis berangkat dari proses kerja tim.” | Kelas status aktual; Market ownership; SaaS optional dalam B2B | `Lihat produk MKL`; `Bahas kebutuhan tim` setelah B2B ada | S1/S5, M1 §4/7; tidak menyatakan semua jalur fully active; REQUIRED |
| T3. Working principles/contact | “Mengapa saya bisa memahami dan menghubungi MKL?” | **Manfaatnya jelas. Batasnya juga.** “Kami ingin informasi produk menjelaskan kegunaan, keterbatasan, dan langkah berikutnya dengan jelas.” | Aspirasi editorial yang dapat ditegakkan; contact actual; bukti hanya jika ada | `Hubungi MKL` → `/kontak`; — | M1 §8/53, C; jangan klaim semua produk diuji tanpa proses evidence; REQUIRED |
| T4. People/history | “Siapa tim di baliknya?” | Belum ditulis | Identitas, consent, kronologi, milestones harus supplied | — / — | O; tidak mengarang; OPTIONAL |

### 8.8 Supporting/compatibility pages

Setiap row berikut memuat minimum content architecture; tidak perlu meniru landing marketing panjang.

| Page/section | Purpose / question | Suggested headline/support | Points | CTA primary / secondary | Evidence / boundary / priority |
|---|---|---|---|---|---|
| Kontak: contact/triage | “Ke mana mengirim pertanyaan?” | **Hubungi tim MKL.** “Untuk pertanyaan produk atau pesanan, hubungi kami melalui email. Untuk kebutuhan kerja tim, ceritakan konteksnya melalui formulir.” | Email `marikitalembur@gmail.com`; order reference bila relevan; jam kerja hanya setelah confirm | `Kirim email` → mailto existing email; `Ceritakan kebutuhan` → intake | L, S3, C; tidak menjanjikan SLA; REQUIRED |
| Kerja Sama: orientation | “Saya publisher, tim, atau pembicara?” | **Pilih jalur kerja sama yang sesuai.** “Ajukan produk untuk Market, bahas kebutuhan kerja tim, atau hubungi kami untuk usulan topik kelas.” | Tiga intent, tidak Etalase/Growth; expert inquiry bukan booking | `Untuk builder` → Partner; `Untuk bisnis` → B2B; speaker inquiry → kontak | S1/S5, M1 §57, C; compatibility, bukan layanan baru; REQUIRED |
| Starter Kit: moved notice | “Di mana starter kit sekarang?” | **Cari starter kit di Market.** “Starter kit termasuk produk digital di MKL Market. Ketersediaan mengikuti katalog yang sudah terbit.” | Jangan janji stok; hapus penjelasan teknis link lama | `Buka Market` → resolved entry; — | S16/L, C; no fake category; REQUIRED |
| Website & SaaS: moved notice | “Di mana produk penerbit?” | **Temukan produk dari penerbit di Market.** “Informasi tiap produk menjelaskan cara akses dan tempat transaksinya.” | Provider identity; no first-party conflation | `Buka Market` → resolved entry; — | S16/S5, C; tidak mengklaim inventory ada; REQUIRED |
| Syarat: scope/rights/contact | “Apa ketentuannya?” | H1 tetap **Syarat & Ketentuan**; badan final memerlukan policy owner | Current operator; scope; payment status; account/access; external provider; contact/version | `Hubungi MKL` → kontak; privacy/refund cross-links | S5/L/O; bukan legal rewrite otomatis; REQUIRED |
| Privasi: data/use/contact | “Apa yang terjadi pada data saya?” | H1 tetap **Kebijakan Privasi**; jelaskan intake dan akun berdasarkan proses aktual | Purpose, recipients, retention/deletion process, contact; no unsupported privacy guarantees | `Ajukan pertanyaan privasi` → kontak; — | S10/L/O; storage saja tidak membuktikan seluruh data processing; REQUIRED |
| Refund: policy/help | “Bagaimana jika ada masalah?” | H1 tetap **Kebijakan Refund**; opening sementara tidak boleh menjanjikan trial mayoritas | Approved eligibility, exclusions, correction/failed fulfilment, provider handling, how to contact | `Hubungi dukungan` → kontak; — | S5/L/O; jangan ganti dengan absolute no-refund; REQUIRED |
| Market handoff on Main | “Apakah ini produk MKL?” | **Jelajahi produk dari para penerbit.** “Produk di Market tetap memakai brand pembuatnya. Pilihan produk sedang disiapkan.” | Saat inventory berubah, update status berdasarkan data; mode transaksi pada detail | `Buka Market` → resolved entry; — | S5/S7/L, M1 §27, C; no subdomain readiness assumption; REQUIRED |

Insight, TulisAI, dan Hitungin tidak mendapat launch marketing sections. Untuk Bisnis memiliki architecture lengkap di §15.

## 9. Copywriting exploration pack dan evaluasi

Copy berikut adalah alternatif yang bermakna, bukan variasi kosmetik. Recommended ditandai **A/B/C pilihan**. Public copy memakai Indonesian; internal labels seperti entitlement/commissioning tidak ikut dipublikasikan.

| Page / high-impact item | A: outcome-led | B: problem-led | C: direct/plain | Pilihan dan alasan |
|---|---|---|---|---|
| Home H1 | Kerja lebih beres, mulai dari kebutuhanmu. | Masih banyak pekerjaan yang bisa dibuat lebih ringan? | Produk, kelas, dan bantuan untuk kerja tim. | **A**: jelas dan luas; lead harus menyebut jalur konkret |
| Home lead | Temukan produk dari MKL, informasi kelas praktis, dan bantuan untuk kebutuhan kerja timmu. | Saat pekerjaan menumpuk, mulai dari proses yang paling perlu dibantu. | Kenali produk MKL, lihat informasi kelas, atau bahas kebutuhan bisnismu. | **C**: paling jelas next actions; B terlalu umum tanpa contoh |
| Home primary CTA | Lihat produk MKL | Cari bantuan untuk pekerjaanmu | Kenali Mari Rekap | **A** untuk portfolio entry; C cocok pada section produk, bukan seluruh brand |
| Produk H1 | Produk untuk membuat kerja lebih beres. | Kurangi pekerjaan yang terus diulang. | Produk MKL untuk pekerjaan nyata. | **C**: paling jelas ownership; B berisiko menjanjikan manfaat semua produk |
| Mari Rekap value | Bantu susun rekap, tetap kamu yang periksa. | Masih menyalin data satu per satu? | Susun bahan rekap menjadi tabel yang bisa diperiksa. | **A**: review-first; C menjadi lead paling spesifik |
| Kelas H1 | Belajar untuk pekerjaan yang kamu hadapi. | Ada cara kerja baru yang ingin kamu kuasai? | Kelas dan workshop praktis dari MKL. | **A**; lebih aman daripada klaim “langsung bisa” saat inventory kosong |
| B2B H1 | Bantu tim bekerja lebih beres. | Proses tim masih banyak kerja ulang? | Solusi kerja yang berangkat dari kebutuhan tim. | **C**: custom boundary paling jelas; A perlu lead konkret |
| B2B primary CTA | Bahas kebutuhan tim | Ceritakan proses yang ingin diperbaiki | Kirim kebutuhan bisnis | **A**; label pada tombol submit tetap “Kirim kebutuhan” |
| Partner H1 | Bantu produkmu lebih mudah dipahami. | Punya produk yang membantu pekerjaan orang lain? | Ajukan produkmu ke MKL Market. | **B**: qualification-led; C tepat untuk CTA, bukan janji publish |
| Tentang opening | Kami ingin membantu pekerjaan jadi lebih beres. | Teknologi berguna ketika menjawab kebutuhan kerja. | MKL — Mari Kita Lembur — membangun produk dan mengembangkan jalur pembelajaran serta bantuan untuk kebutuhan bisnis. | **C** dengan lead lebih ringkas di §8.7; A/B terlalu generik sendiri |
| Intake H1 | Mulai dari pekerjaan yang ingin kamu bereskan. | Bagian pekerjaan mana yang paling menyulitkan? | Ceritakan kebutuhanmu. | **A**; B sebagai hint; C cukup jelas tetapi kurang konteks |

Section headline alternatives yang berdampak:

- Home pathways: **“Mau membereskan apa?”** (recommended) atau “Mulai dari kebutuhanmu”.
- B2B services: **“Pilih bantuan sesuai tahap timmu.”** (recommended) atau “Dari memahami proses sampai mendampingi penerapan”.
- B2B workflow: **“Pahami prosesnya, sepakati langkahnya.”** (recommended) atau “Cara kerja yang dimulai dari kebutuhan”.
- Product limitations: **“Hasil tetap perlu diperiksa.”** (recommended) atau “AI membantu; keputusan akhir tetap padamu”.

| Direction | Clear nontechnical? | Outcome? | Specific? | Truth? | Generic/length/jargon | CTA fit |
|---|---|---|---|---|---|---|
| Home A + lead C | Ya | Ya, aspiration | Cukup setelah pathways | Tidak menjanjikan metric | H1 pendek, tanpa ecosystem lecture | Portfolio primary, B2B secondary |
| Produk C | Ya | Lead memberi manfaat | Ownership jelas | Ya untuk published list | Hindari “first-party” di public copy | Detail produk |
| Mari Rekap A | Ya | Rekap + human review | Tinggi setelah workflow | Baseline-supported; final product approval | Tidak absolute “tanpa ketik” | Cara kerja dahulu, akses sesuai state |
| Kelas A | Ya | Practical learning | Masih perlu actual class topic | Aman dengan empty status | Tidak menjual pengalaman yang belum ada | Topic suggestion sekarang |
| B2B C | Ya | Team workflow | Services memberi detail | Direction-supported; service readiness O | Tidak menggunakan slogan transformasi kosong | Intake existing |
| Partner B | Ya | Menolong publisher menguji fit | Jelas audience | Tidak guarantee traffic | Tidak menumpuk commerce jargon | Registration/review |
| Tentang minimum | Ya | Bukan sales claim | Ownership jelas | Hanya known facts | Founder/history tidak direka | Produk atau kontak |

Copy yang **tidak boleh dipakai sekarang**: “TulisAI siap dibeli”; “booking expert”; “ribuan pengguna”; “hemat X%”; “akurasi 99%”; “sinkronisasi dua arah Google Sheets” sebagai Mari Rekap current feature; “auto-renewal”; “semua produk diuji”; “sebagian besar produk punya trial”; “pasti terbit/pasti laku”; “layanan tersedia 24/7”; jadwal pembukaan pembayaran tanpa keputusan nyata.

## 10. CTA map

Destination `Market-resolved` berarti `/jelajahi` pada observasi sekarang dan origin Market hanya setelah resolver mengaktifkannya. Repeated CTA dengan intent sama digabung tetapi posisi asal disebut.

| Page | Section | CTA current / proposed | Destination | User intent | Current state | Recommended state | Issue |
|---|---|---|---|---|---|---|---|
| Global | Header | Produk | `/produk-kami` | Product discovery | Valid | KEEP | Isi destination perlu lengkap |
| Global | Header | Kelas | `/kelas` | Learning | Valid empty | KEEP | Jangan janji stok |
| Global | Header | Tentang | `/tentang` | Entity trust | Valid stale | REWRITE target | Old story |
| Global | Header | Buka Market → Market ↗ conditional | Market-resolved | Publisher products | Valid 0 inventory | KEEP handoff | Arrow/origin harus sesuai |
| Global | Header | Untuk Bisnis proposed | `/untuk-bisnis` | B2B evaluation | 404 | ADD only after page | Unsupported destination saat ini |
| Global | Utility | Akun/Masuk | `/akun` or `/masuk` | Account | Source/session dependent | KEEP | Bukan marketing CTA |
| Global | Footer | Cari produk | `/cari` → Market | Search | Valid redirect | Remove redundant Main entry | Duplicate intent |
| Global | Footer | Starter Kit / Website & SaaS | Legacy notice | Category discovery | Valid but thin | Remove footer prominence | Compatibility overexposed |
| Global | Footer | Kerja Sama | `/kerja-sama` | Mixed inquiry | Valid obsolete | Compatibility orientation | Wrong business lines |
| Home | Hero | Lihat Produk Kami → Lihat produk MKL | `/produk-kami` | Choose product | Valid | KEEP/relabel | Generic but usable |
| Home | Hero | Buka Market | Market-resolved | Discovery | Valid empty | Secondary contextual | Current secondary displaces B2B |
| Home | Showcase | Mari Rekap card | `/produk/mari-rekap` | Inspect product | Valid thin | Fill before promote | Content dead end |
| Home | Pathways + product block | Lihat Produk Kami repeated | `/produk-kami` | Same intent | Multiple repeats | One focused product path plus hero | Excess repetition |
| Home | Pathways + class block | Lihat Kelas | `/kelas` | Learning | Valid empty | Lihat informasi kelas when empty | Expectation management |
| Home | Class empty | Usulkan topik | `/ajukan-kebutuhan` | Suggest topic | Generic form | Usulkan topik kelas + clearer hint | Intent not captured |
| Home | Market + categories | Buka Market / eight category links | Market-resolved/filter redirects | Marketplace discovery | All empty | One Market handoff at launch | Excess taxonomy for no supply |
| Home | Closing customer | Ajukan Kebutuhan | `/ajukan-kebutuhan` | Custom need | Valid | Via B2B context where appropriate | B2B proposition missing |
| Home | Closing publisher | Pelajari untuk Partner | `/untuk-partner` | Publisher evaluation | Valid | Pelajari kemitraan Market | Keep separate intent |
| Produk | Mari Rekap | Lihat detail → Kenali Mari Rekap | Product detail | Evaluate | Valid | Specific label | Detail blank |
| Produk | Zero products branch | Ajukan Kebutuhan | Intake | Unmet need | Source-only alternative state | KEEP | Do not populate fake products |
| Product | Breadcrumb | Jelajahi | `/jelajahi` | Parent context | Valid wrong surface | Produk → `/produk-kami` for Mari Rekap | Main/Market conflation |
| Product | Existing access | Buka Aplikasi | `/apps/marirekap` | Use product | **404 observed** | Approved application/access destination | **Dead CTA P0** |
| Product | Anonymous offers | Pembayaran online segera dibuka | No link | Buy | Non-action state repeated 7× | One truthful status: pembayaran publik belum tersedia | “Segera” unsupported timing |
| Product pattern | Paid | Beli Sekarang | `/checkout/:offerId` | Buy eligible item | Conditional; disabled for portfolio | Preserve product-type contract | Never force portfolio into guest checkout |
| Product pattern | Trial | Coba Gratis | `/apps/:app_key` | Trial | Conditional source, not Mari Rekap public evidence | Only verified mapped route | app_key does not prove URL exists |
| Product pattern | External | Kunjungi Situs Penyedia | `/go/:slug` | Provider access | Conditional listing | KEEP when commissioned | No tracked redirect invoked in audit |
| Product | Proposed explainer | Lihat cara kerjanya | On-page workflow | Understand | Section absent | ADD CONTENT | Not substitute for access fix |
| Kelas | Empty | Usulkan Topik | Intake | Topic inquiry | Valid | Specific topic label | Generic intake hint |
| Class pattern | Listing | Lihat detail | `/produk/:slug` | Evaluate class | No instance | Lihat isi dan jadwal kelas when real | Needs class facts on detail |
| B2B | Hero/final | Bahas kebutuhan tim | Intake | Explain business need | Page absent | ADD | Same existing storage |
| B2B | Hero secondary | Lihat bentuk bantuan | On-page services anchor | Compare fit | Proposed | ADD if content exists | No new service pages needed |
| B2B | Service rows | No CTA per row | — | Compare | Proposed | KEEP informational | Avoid repeated conversion pressure |
| Intake | Form | Kirim Kebutuhan | Same route POST | Submit | Source implemented | KEEP | Not submitted in audit |
| Intake | Confirmation | Return link proposed | Home or actual origin page | Closure | Text success only | ADD concise next step | No fake booked call |
| Partner | Final | Buka Workspace Partner | `/partner` | Register/manage | Anonymous auth redirect | Mulai pengajuan partner | Label should explain first step |
| Partner | Final | Tanya Dulu | Intake | Clarify partnership | Valid | Tanya soal kemitraan | Generic intent |
| Tentang | Proposed | Lihat produk MKL / Hubungi MKL | Products/contact | Continue | No body CTA | ADD one or two useful links | Dead-end prose |
| Kerja Sama | Body | Hubungi Kami | `/kontak` | Mixed inquiry | Valid | Intent-specific routes | Avoid same generic contact for all |
| Kontak | Body | Email/Intake text | Email / intake | Contact | Plain text in CMS observed | Add working links | Missing actionable handoff |
| Legal | Body | Kontak mentioned | `/kontak` | Policy help | Plain text, no body links observed | Explicit link | Support dead end |
| Compatibility | Notice | Buka MKL Market | Market-resolved | Old-link recovery | Valid | KEEP | No need to duplicate content |
| Insight/TulisAI | Any launch CTA | None | — | Future | Not available | Remain absent | Premature exposure |

## 11. Global content consistency findings

| Phrase/pattern | Classification | Reason / replacement direction |
|---|---|---|
| “Kerja beres. Lembur enggak.” | KEEP as brand signature | Ada pada SoT/playbook; bukan jaminan hasil semua pelanggan |
| “Produk digital. Cara kerja baru.” | REWRITE | Terlalu luas dan belum menjelaskan manfaat/context |
| “Portofolio first-party” | REWRITE | Public: “Produk dari MKL” |
| “Aplikasi SaaS yang dibangun dan dioperasikan MKL” | KEEP meaning, simplify | “Aplikasi yang kami bangun sendiri” bila scope jelas |
| “kami tidak mewarnai ulang produk…” | REMOVE | Internal design reasoning bukan user value |
| “Halaman ini membaca registry produk…” | REMOVE | Internal architecture |
| “Ringkasan produk ini belum ditulis…” | REMOVE by filling real summary | Jangan menyembunyikan kekosongan dengan manfaat rekaan |
| “Didistribusikan melalui MKL” pada Mari Rekap | REWRITE | First-party endorsement lebih tepat; Market tetap publisher-owned |
| “Satu akun untuk tiga hal” | REWRITE/de-emphasize | Supporting fact jika perlu, bukan parent promise |
| “Kami bantu jualnya” | REWRITE | “Ajukan produkmu untuk dipertimbangkan di Market” lebih sesuai readiness |
| “MKL Etalase”, “MKL Growth” sebagai business paths | REMOVE | SoT sudah menggantinya |
| “Dijual lewat MKL” tanpa status gate | REWRITE | Bedakan supported model dari aktifnya transaksi |
| “Belum ada jadwal kelas yang dibuka” | KEEP | Truthful empty state |
| “tidak ada kelas contoh … mengisi halaman” | REMOVE | Governance internal |
| “Belajar dari yang mengerjakannya” | COPY EXPLORATION | Arah bagus, tetapi actual instructor perlu evidence |
| “Produk dikurasi dan diuji sebelum tampil” | OWNER DECISION REQUIRED | Review bukan otomatis bukti functional testing semua produk |
| “Sebagian besar produk menyediakan trial” | REMOVE pending evidence | Inventaris nyata tidak mendukung mayoritas trial |
| “Refund maksimal 7 hari” | OWNER DECISION REQUIRED | Tidak cocok diputuskan dari seed copy; jangan otomatis ganti absolute no-refund |
| “Pembayaran online segera dibuka” | REWRITE | “Pembayaran publik belum tersedia” tidak menjanjikan tanggal |
| “Coba Gratis/Mulai gratis” | CONDITIONAL KEEP | Hanya bila ada trial/access path nyata, bukan karena playbook memberi contoh |
| Insight/expert booking/TulisAI available | FUTURE ONLY | Capability dan inventory belum terbukti |
| Mari Rekap Sheets two-way sync/auto-sync | FUTURE ONLY | Jalur D belum current public capability |

## 12. SEO / content metadata audit

### 12.1 Keadaan global yang diamati

- Seluruh halaman HTML 200 yang diperiksa mengirim **`noindex, nofollow`**.
- [`robots.txt`](https://marikitalembur.com/robots.txt) merespons `User-agent: *` dan `Disallow: /`.
- [`sitemap.xml`](https://marikitalembur.com/sitemap.xml) adalah XML valid dengan `urlset` kosong.
- Ini konsisten dengan prelaunch fail-closed policy. **Bukan instruksi untuk membuka indexing sekarang.** Aktivasi merupakan release decision terpisah.
- OG title/description dan JSON-LD tidak ditemukan pada halaman HTML yang diperiksa. Ketiadaan markup bukan alasan membuat fakta baru.
- Product detail Mari Rekap mempunyai **dua canonical identik** dari root dan route meta. Source root tidak menghapus canonical ketika child menambahkannya. Perlu satu canonical otoritatif per response; evaluasi juga split-origin behavior ketika Market kelak diaktifkan.
- Root menghasilkan canonical pada beberapa error slug 404. Jangan memasukkan 404 ke sitemap; periksa policy error/noindex sebelum indexing dibuka.
- `MAIN_PATHS` sitemap berisi `/`, `/kelas`, `/starter-kit`, `/website-saas`, `/untuk-partner`; **tidak berisi `/produk-kami`**, Tentang, Kontak, atau legal CMS. Belum ada mekanisme mengambil published CMS pages untuk sitemap.
- Sitemap meminta catalog `limit:1000`, tetapi `listPublishedCatalog` melakukan clamp maksimum **60**. Bukan kehilangan URL pada inventory saat ini, tetapi risiko pertumbuhan yang terbukti pada source.
- Prefix noindex `"/app"` tidak mencakup `"/apps"` karena boundary matching. `/apps/hitungin` mendapat canonical dan saat ini hanya tertahan global noindex. Perlu explicit private/legacy app policy sebelum global indexing diaktifkan.

### 12.2 Metadata current per page

`self` berarti canonical ke URL halaman sendiri. `N` berarti noindex/nofollow sekarang. Sitemap live seluruhnya kosong; kolom map adalah perilaku source **jika flag indexing aktif**. OG/LD tidak ditemukan pada semua HTML rows di bawah.

| Page | Current title | Current meta description | Canonical / index | Source sitemap & links |
|---|---|---|---|---|
| `/` | MKL — Produk digital. Cara kerja baru. | Aplikasi dari MKL, kelas praktis, dan pilihan produk digital dari para penerbit — di atas satu akun. | self / N | Included; header, pathways, product, footer |
| `/produk-kami` | Produk Kami — MKL | Aplikasi SaaS yang dibangun dan dioperasikan sendiri oleh MKL. | self / N | **Omitted**; nav/footer/home |
| `/produk/mari-rekap` | Mari Rekap — MKL | **Kosong** | **self ×2** / N | Published catalog eligible; incoming home/Produk; wrong Market breadcrumb |
| `/kelas` | Kelas Praktis — MKL | Kelas praktis untuk pekerjaan nyata: live atau rekaman, tiket lewat akun MKL. | self / N | Included; nav/home/footer |
| `/untuk-partner` | Untuk Partner — MKL | Terbitkan produk digitalmu lewat MKL Market: daftarkan organisasi, ajukan produk, lalu terbit setelah review. | self / N | Included; footer/home/Market |
| `/ajukan-kebutuhan` | Ajukan Kebutuhan — MKL | Ceritakan kebutuhanmu secara privat. Tim MKL akan bantu carikan solusinya. | self / N | Omitted; linked from several intents |
| `/tentang` | Tentang MKL — MKL | **Kosong** | self / N | Omitted CMS; primary nav/footer |
| `/kerja-sama` | Kerja Sama — MKL | **Kosong** | self / N | Omitted CMS; footer |
| `/kontak` | Kontak — MKL | **Kosong** | self / N | Omitted CMS; footer/body mentions |
| `/syarat-ketentuan` | Syarat & Ketentuan — MKL | **Kosong** | self / N | Omitted CMS; footer |
| `/kebijakan-privasi` | Kebijakan Privasi — MKL | **Kosong** | self / N | Omitted CMS; footer |
| `/kebijakan-refund` | Kebijakan Refund — MKL | **Kosong** | self / N | Omitted CMS; footer |
| `/starter-kit` | Starter Kit — MKL | Starter kit sekarang berada di MKL Market. | self / N | Included despite compatibility status |
| `/website-saas` | Website & SaaS Pilihan — MKL | Listing website dan SaaS pihak ketiga sekarang berada di MKL Market. | self / N | Included despite compatibility status |
| `/jelajahi` | Jelajahi Produk — MKL | Temukan tools, aplikasi, kelas, dan starter kit di MKL. | self on current origin / N | Market path included on single-origin; handoff issue: class scope ambiguous |
| `/cari` | Redirect, no independent title | — | 302 to `/jelajahi` (+q) | Not an independent sitemap landing |
| Eight `/kategori/:slug` | Redirect, no independent title | — | 302 to filtered `/jelajahi` | Destination shares generic title and base canonical |
| `/apps/hitungin` | Hitungin — Kalkulator Harga Jual — MKL | Hitung harga jual minimum, margin, dan biaya marketplace dalam hitungan detik. | self / N now | Omitted sitemap; no `/apps` prefix exclusion |
| `/untuk-bisnis` | No page title in observed 404 | — | self on 404 / N | Absent |
| `/insight` | No page title in observed 404 | — | self on 404 / N | Absent |
| `/produk/tulisai` | No page title in observed 404 | — | self on 404 / N | Absent instance |
| `/apps/marirekap` | No page title in observed 404 | — | No canonical observed / N | Unrouted |

### 12.3 Target metadata and discovery requirements

Titles below are **final browser title suggestions**, not necessarily literal `seo_title` field values: CMS/product renderer appends `— MKL`, so avoid adding a second suffix in stored fields. OG title/description can follow the approved title/description, with absolute canonical URL; do not fill OG with future claims.

| Page | Suggested title / description | Search intent / links | Canonical, structured data, sitemap/index target |
|---|---|---|---|
| Home | **MKL — Produk dan Bantuan untuk Kerja Lebih Beres** / “Kenali produk MKL, lihat informasi kelas praktis, dan bahas kebutuhan kerja tim. Mulai dari pekerjaan yang ingin kamu bereskan.” | Brand, practical work; link Products/Kelas/B2B/About/Market | One self canonical; Organization with verified identity; include when launch indexing approved |
| Produk | **Produk MKL untuk Pekerjaan Nyata — MKL** / “Kenali aplikasi yang dibangun MKL, kegunaannya, dan status aksesnya. Temukan produk yang sesuai dengan pekerjaanmu.” | First-party software; detail link | self; optional ItemList only actual visible products; include |
| Mari Rekap | **Mari Rekap — Rekap Struk dan Invoice ke Excel — MKL** / “Kenali cara Mari Rekap membantu menyusun bahan rekap menjadi tabel yang bisa diperiksa, diedit, dan diekspor. Lihat kemampuan dan status aksesnya.” | Rekap struk/invoice ke Excel; products/contact/policies | one placement canonical; SoftwareApplication only approved fields; no rating/Offer availability invented; include published instance |
| Kelas | **Kelas dan Workshop Praktis — MKL** / “Informasi kelas dan workshop untuk kebutuhan kerja. Belum ada jadwal yang dibuka? Usulkan topik yang ingin kamu pelajari.” | Practical learning, not fake class keywords | self; no Course/Event while empty; include informational page when launch approved |
| Class detail future | Actual title/outcome/schedule only | Topic/prerequisite intent | Main placement; Course/Event only matching visible verified fields; real instance only |
| B2B | **Solusi Kerja dan AI untuk Bisnis — MKL** / “Bahas proses kerja yang ingin diperbaiki, kebutuhan pelatihan, atau penerapan AI di tim. Mulai dari kebutuhan bisnis, lalu sepakati langkah yang sesuai.” | AI untuk bisnis; custom workflow/training; intake and supporting contact | self when 200; truthful Organization/Service optional; include only once real page/services ready |
| Partner | **Ajukan Produk ke MKL Market — MKL** / “Pelajari kecocokan produk, kepemilikan brand, dan proses pengajuan partner untuk MKL Market.” | Builder publishing/distribution | self; no guarantee/sales markup; include marketing page, exclude workspace |
| Intake | **Ceritakan Kebutuhan Kerja Tim — MKL** / “Kirim proses yang ingin diperbaiki dan hasil yang diharapkan agar tim MKL dapat meninjau kebutuhanmu.” | Conversion support; link privacy/contact | Prefer explicit noindex for operational form; omit sitemap; this is recommendation, not current permanent policy |
| Tentang | **Tentang MKL — Mari Kita Lembur** / “Kenali MKL, peran produk yang kami bangun, hubungan dengan penerbit di Market, dan cara menghubungi tim.” | Entity/brand trust | self; Organization reuse same identity, not multiple companies; include |
| Kontak | **Kontak MKL — Produk dan Kebutuhan Bisnis** / “Hubungi tim MKL untuk pertanyaan produk, pesanan, dan kebutuhan kerja tim melalui kanal yang tersedia.” | Navigational contact | self; verified contact facts only; include if approved public support index |
| Three legal pages | Keep descriptive title; add factual one-sentence scope | Policy lookup, not acquisition | self; approved policy content/version; no promotional schema; public index policy deliberate |
| Kerja Sama + legacy notices | Clear compatibility titles, concise directions | Old-link recovery | Prefer noindex/omit sitemap while thin notices remain; no route deletion mandated |
| Market transition | Label/copy truthful about publisher and empty inventory | Separate Market-owned search intent | Do not put Market inventory in Main sitemap after split; actual origin resolver governs |
| Insight | No metadata published yet | Owned editorial future | Article author/date/source, canonical and real inventory required first |
| TulisAI | No metadata campaign now | Future first-party writing | Name/domain/readiness gates before public SEO investment |

**GEO/AEO:** gunakan answer-first content dari page sections, bukan FAQ massal. Evidence assets yang bernilai: contoh alur milik MKL, eksperimen terdokumentasi, metodologi, dan kasus yang memiliki izin. Belum ada dasar untuk benchmark, client results, atau statistik. Tidak ada janji ranking/citation AI. Search Console, crawl logs, dan external indexing status tidak diakses dalam audit ini.

## 13. Missing-content backlog

P0 berarti perlu sebelum **launch redesign/content yang bersangkutan**, bukan izin mengubah urutan payment Jalur A.

| ID | Priority | Work item | Owner/dependency | Acceptance |
|---|---|---|---|---|
| C01 | P0 | Mari Rekap summary, outcome, fit, workflow, limitations | Product + content; S15/current product facts | Portfolio dan detail menjelaskan manfaat sama; tidak ada placeholder |
| C02 | P0 | Correct Mari Rekap owned-user access destination | Engineering/product contract | Existing access CTA mencapai application path sah; no guest checkout workaround |
| C03 | P0 | Publish-ready B2B parent content | Business/service owner + M1 §4–5 | Custom framing, ready services only, one intake seam |
| C04 | P0 | Rewrite Kerja Sama retired business lines | Content/business SoT | Tidak ada Etalase/Growth sebagai jalur mandiri |
| C05 | P0 | Reconcile About trust claims and policy promises | Owner/legal/operations | Claim register supports each published commitment; no invented refund policy |
| C06 | P0 | Separate publication/access/payment wording | Product/release owner | Harga tidak menyiratkan checkout aktif; “segera” tanpa date dihapus |
| C07 | P0 | State-gated nav and CTA destinations | Redesign/content team | Tidak ada nav 404, premature Insight/TulisAI, dead required CTA |
| C08 | P0 | Keep Kelas/Market empty state truthful | Content + inventory | Tidak ada fake stock, instructor, testimonials, or schedule |
| C09 | P1 | Rewrite homepage outcome and remove repeated architecture prose | Content | Short hero; focused paths; one main idea per section |
| C10 | P1 | Add first-party endorsement and correct breadcrumb | Content/engineering | Mari Rekap → Produk; class → Kelas; Market ownership stays distinct |
| C11 | P1 | Fill page title/description/OG and one canonical | Content/engineering | No empty product/About description; one canonical; no duplicated suffix |
| C12 | P1 | Sitemap candidate list + catalog pagination/limit | Engineering | Produk and appropriate CMS included; compatibility excluded; no 60-row truncation |
| C13 | P1 | Explicit `/apps` and operational intake index policy | Engineering/release | Global launch flag cannot expose legacy/private app unintentionally |
| C14 | P1 | Intake hints, privacy link, success next step | Content/operations | Better inquiry context without long form or SLA invention |
| C15 | P1 | Partner fit, staged process, readiness disclosures | Partnership owner | Registration ≠ approval ≠ publish ≠ commerce |
| C16 | P1 | Contact body links + support hours evidence | Operations/content | Email/intake/policy help actionable; hours approved |
| C17 | P2 | Real demonstrative product content | Product/content | Actual redacted example, method and permission; no fake screenshot/metric |
| C18 | P2 | Extend About people/history if useful | Owner | Verified biographies/history + publication consent |
| C19 | P2 | Intake source/intent and follow-up workflow improvement | Operations/engineering | One database, explicit storage/ownership; no pretend query-param behavior |
| C20 | P2 | Service-specific pages | Business/content | Only real distinct offers with enough useful content; no thin keyword pages |
| C21 | FUTURE | Owned Insight hub | Editorial/product | Real articles, author/date/source model and routes; then nav |
| C22 | FUTURE | Actual Kelas inventory/detail enhancement | Learning operations | Speaker, topic, dates, access, price verified; no LMS claim |
| C23 | FUTURE | Expert discovery/booking | Product/operations | Capability + real profiles before promotion |
| C24 | FUTURE | TulisAI communication | Track B/product | Outside V1 until approved readiness; name/domain and commercial gates |
| C25 | FUTURE | Mari Rekap vNext claims | Track D/product | Per-capability implementation/test/enforcement/public approval |
| C26 | FUTURE | Market separate-host activation and supply claims | Release/partnership | Existing commissioning gates; not a content-only switch |

## 14. Tentang/About source gaps

**SUPPORTED CONTENT:** MKL name, parent identity, first-party Mari Rekap, separate Market publisher relationship, Kelas placement, current roadmap limits. Marketing supports practical work/AI direction and custom business services.

**COPY EXPLORATION:** concise identity paragraph, role explanation, working principles framed as commitments/intent, useful links. No need for fabricated founder narrative.

**SOURCE GAP / OWNER DECISION:** public legal/operator identity; approved team/founder biographies; founding date/milestones; actual curation/test methodology; current support hours/capacity; permission for customer names/cases; specific story the owner wants to tell. These are optional expansion inputs except identity/policy facts needed for accurate support/legal content.

Current “produk dikurasi dan diuji sebelum tampil” needs evidence of the test process, scope, and responsibility. A review queue alone does not substantiate that every product has been functionally tested. Current “pembayaran aman” must not be used as proof of a commercially active payment path.

## 15. Untuk Bisnis deep-dive `/untuk-bisnis`

**Current:** 404; no explicit route; generic CMS infrastructure could serve one slug but no published page observed. **Target:** NOW content page, **NEEDS OWNER INPUT** for which services can actually be offered now. Marketing source supports the portfolio as direction; it does not prove team capacity, delivery history, pricing, SLA, or every service commercially available today.

**Primary audience:** business owners, heads/managers, operations/marketing/creative teams with a specific workflow need. **Question:** “Dapatkah MKL membantu tim saya, bentuk bantuannya apa, dan bagaimana memulai?” **Desired outcome:** informed inquiry into existing Ajukan Kebutuhan.

**Locked:** custom work; SaaS optional if relevant; no separate billing/product funnel; no second lead database. **Recommended message:** kebutuhan tim menentukan bentuk bantuan—understanding process, learning, scoped implementation, or ongoing advice. **H1:** “Solusi kerja yang berangkat dari kebutuhan tim.” **Lead:** “Mulai dari proses yang ingin diperbaiki. Kita bahas kebutuhan, hambatan, dan bentuk bantuan yang paling sesuai—pelatihan, perbaikan alur kerja, atau penerapan solusi.” Draft “kita” assumes an actual staffed inquiry process; operational owner must confirm.

### 15.1 Nine focused sections

| Section | Purpose / main question | Suggested headline | Suggested supporting copy | Key points | Primary / secondary CTA | Evidence | Truth boundary | Priority |
|---|---|---|---|---|---|---|---|---|
| U1 Hero | Orient decision-maker; “Apa bantuan MKL?” | **Solusi kerja yang berangkat dari kebutuhan tim.** | “Mulai dari proses yang ingin diperbaiki. Kita bahas kebutuhan, hambatan, dan bentuk bantuan yang sesuai.” | Custom context; practical work | `Bahas kebutuhan tim` → intake; `Lihat bentuk bantuan` → U4 | M1 §4/30, M3, C | No guaranteed transformation/result | REQUIRED |
| U2 Problems | Recognition; “Masalah saya termasuk?” | **Saat pekerjaan berulang mulai menghambat tim.** | “Data disalin dari banyak tempat, hasil kerja diperiksa berulang, atau tools baru belum menyatu dengan proses yang ada.” | Manual transfer; repeated review; unclear tool use | — / — | M1 §4–6, C | Examples, not client case studies | REQUIRED |
| U3 Audience/fit | Qualification; “Cocok untuk tim saya?” | **Untuk tim yang ingin memperbaiki cara kerjanya.** | “Cocok untuk pemilik bisnis dan pemimpin tim yang punya proses nyata untuk dipelajari bersama.” | Marketing/creative, operations/admin, management; process owner participation | — / — | M1 §6, C | No minimum headcount or industry expertise invented | REQUIRED |
| U4 Forms of help | Compare; “Mulai dari audit, training, atau implementasi?” | **Pilih bantuan sesuai tahap timmu.** | “Belum tahu harus mulai dari mana? Jelaskan kebutuhannya dulu. Bentuk bantuan ditentukan dari tujuan dan kondisi tim.” | Five service families below; only publish ready ones | — / — | M1 §5/30 | Portfolio direction ≠ all commercially available | REQUIRED |
| U5 Process | Reduce uncertainty; “Bagaimana cara kerjanya?” | **Pahami prosesnya, sepakati langkahnya.** | “Mulai dari kebutuhan bisnis, pelajari alur kerja, lalu sepakati ruang lingkup sebelum pelatihan atau penerapan.” | Discovery → workflow review → scoped design → training/implementation → adoption review where agreed | — / — | M1 §4/5 | Proposed method; no automatic proposal, fixed duration, or SLA | REQUIRED |
| U6 Deliverables | Tangibility; “Apa yang saya terima?” | **Hasil kerja yang bisa dipakai tim.** | “Keluaran mengikuti ruang lingkup: bisa berupa peta proses, materi praktik, dokumentasi, atau solusi yang diuji pada pekerjaan nyata.” | Tie output to agreed service; distinguish deliverables from performance results | — / — | M1 §4.3/5 | “Bisa berupa”, not every output included in every engagement | REQUIRED |
| U7 Readiness/limits | Self-qualification; “Apa yang harus siap?” | **Ada proses yang jelas, ada orang yang bisa diajak bekerja.** | “Pembahasan lebih berguna ketika tim dapat menjelaskan proses saat ini, kendala, dan hasil yang diharapkan.” | Process owner; appropriate sample/context; constraints; scoped decision authority | — / — | M1 §4/31, C | Do not request sensitive production data in initial public form; no assessment guarantee | REQUIRED |
| U8 Working principles | Trust; “Bagaimana MKL membuat keputusan?” | **Mulai dari kebutuhan, tetap periksa hasilnya.** | “AI dipertimbangkan ketika sesuai dengan pekerjaan. Batas, pemeriksaan manusia, dan tanggung jawab operasional perlu disepakati.” | Best-fit tools incl third-party/MKL only when relevant; review; documented scope | — / — | M1 §4/53, M2 | No compliance certification, security guarantee, or quantified results invented | REQUIRED |
| U9 Intake handoff | Conversion; “Apa langkah pertama?” | **Ceritakan proses yang ingin kamu perbaiki.** | “Kirim gambaran kebutuhan dan hasil yang diharapkan. Tim MKL akan meninjau informasi itu untuk pembahasan berikutnya.” | Existing form; describe what happens; no booked meeting claim | `Bahas kebutuhan tim` → `/ajukan-kebutuhan`; `Punya pertanyaan dulu?` → `/kontak` | S10, M1 §31, C/O | Operational follow-up owner needed; no promised turnaround | REQUIRED |

Nine sections are nine distinct decisions, not nine essays. U3 and U7 can be adjacent concise blocks if they repeat. U6 can be incorporated into service rows if a separate deliverables section adds no information. Keep core coherent; do not mechanically preserve section count.

### 15.2 Service content, supported as portfolio direction

Each row is **SOURCE-SUPPORTED POSITIONING + COPY EXPLORATION**, with **OWNER DECISION REQUIRED** for present offer readiness. No pricing, duration, case results, team capacity, or guaranteed outcome is inferred.

| Service | Suggested headline/support | Problem addressed | What client may get, scoped | Fits | May not fit | CTA / evidence |
|---|---|---|---|---|---|---|
| AI Productivity Audit | **Temukan bagian kerja yang paling perlu diperbaiki.** “Petakan proses dan hambatan sebelum memilih penggunaan AI atau otomatisasi.” | Many possible improvements, unclear priority | Workflow map, bottleneck/opportunity priorities, risk notes, next-step recommendation | Team can describe actual workflow and constraints | Wants instant tool purchase without examining work; no process owner | No separate CTA; shared intake; M1 §5.1 |
| Private AI Academy | **Belajar memakai AI dari pekerjaan tim sendiri.** “Materi dan latihan disusun berdasarkan peran, tools, dan kebutuhan kerja yang disepakati.” | Generic training does not translate to work | Custom curriculum, practice briefs, assessment/adoption plan if scoped | Team learning and review needs are concrete | Wants certification/guaranteed productivity increase not actually offered | Shared intake; M1 §5.2 |
| AI Workflow Sprint | **Uji satu alur kerja yang paling penting dulu.** “Fokus pada kebutuhan yang jelas agar solusi dapat dicoba dan diperbaiki.” | A specific use case needs working process/prototype | Scoped workflow/prototype/automation, review points, documentation as agreed | One bounded problem with stakeholder participation | Unbounded organization-wide transformation under a short sprint promise | Shared intake; M1 §5.3; no duration invented |
| AI Implementation | **Terapkan solusi dengan cara kerja yang jelas.** “Bawa solusi yang sudah disepakati ke proses tim, lengkap dengan pengujian dan penanggung jawabnya.” | Prototype/decision exists but rollout/ownership incomplete | Scoped integration, testing, docs, user training, monitoring/ownership plan | Defined scope and access/resources available | Expects any integration without feasibility/access review | Shared intake; M1 §5.4 |
| Advisory / Retainer | **Tinjau penerapan, perbaiki langkah berikutnya.** “Pendampingan berkala untuk menilai penggunaan, hambatan, dan perubahan kebutuhan tim.” | Adoption/optimization needs continuity | Review cadence and advisory scope agreed separately | Existing initiative has owner and recurring decisions | Expects unlimited engineering, guaranteed response, or SaaS subscription | Shared intake; M1 §5.5; retainer ≠ product subscription |

Service pages `/untuk-bisnis/ai-productivity-audit`, `/private-ai-academy`, `/ai-workflow`, `/implementation`, `/advisory` are **not launch requirements**. M2 permits them only for real, distinct offers with sufficient content. Current generic CMS only supports one segment; nested service routes would need implementation, so do not publish dead links to them.

**Trust approach:** approved process explanation is usable without invented logos/testimonials. Real methods, examples, and limitations can support evaluation. Case studies remain optional until actual evidence and permission exist. B2B page may mention Mari Rekap as one possible tool in a fit conversation; it must not route every visitor to Mari Rekap pricing.

## 16. Builder/Partner boundary findings

- `/untuk-partner` is the public marketing page; `/partner` is the authenticated operational workspace. Keep both.
- Partner audience supplies a product; B2B audience brings a workflow/business need. The service pages must not collapse those jobs.
- Current Partner content correctly preserves publisher brand and avoids default rates. Keep those meanings.
- Current step copy misses the importance of **organization approval before product submission**; source workspace states that gate explicitly.
- Current two-mode copy describes checkout/distribution in present tense. Reframe as supported models subject to actual partner/product commissioning; source-built mode is not proof of active partner commerce.
- The live Market transition currently has 0 products. Do not claim traffic, featured placement, analytics availability, or established sales volume.
- Editorial opportunity is editorially conditional, not a benefit guaranteed by registration or payment.

## 17. Mari Rekap communication findings

**Exposure found:** homepage stage/card, Produk list, product detail. No dedicated first-party nav/footer entry; generic Products provides the path. B2B page absent. No need to add a Mari Rekap primary-nav item.

**Publication and commercial state:** the catalog is publicly visible. Anonymous detail shows Starter Rp19.000, Pro Rp75.000, Business Rp299.000, Scale Rp599.000 and topup_20 Rp25.000, topup_100 Rp99.000, topup_500 Rp399.000. These match A4 receipt values, but are not a proof of current purchase availability. The public UI says payments not yet opened. Existing browser access state shows an entitlement-dependent button; it must not be generalized into all visitors having access.

**Offer presentation issue:** ordering mixes package and top-up rows and displays technical top-up names; no visible monthly term/credit explanation in observed anonymous body. Recommend user-readable package vs additional-credit grouping and truthful units/periods from approved contract. Do not make a second hardcoded price authority. Do not label monthly access auto-renewal.

**Missing content:** summary, outcome, input/output, who it fits, workflow, review control, limits, focused FAQ, metadata description, and first-party endorsement. Generic product template can render most of this, but `not_for` and class-specific data have rendering gaps.

**Blocked claim set:** D3 Locked/Discovery modes, D4 line-item foundation, D5 Excel import/template output, D6 Sheets two-way sync, D7 auto-sync, D8 control-center UX, D9 commercial activation cannot be advertised as current because the active roadmap only claims D0 next. Ordinary current XLSX export must not be confused with future Excel import/template support.

**Evidence boundary:** S15 records baseline photo/PDF/text, review/edit, and Excel export. It also warns that copy and register status are not enforcement/runtime proof. This audit did not execute extraction/export on the child app. Draft inside that baseline, then product owner checks the exact public capability list before publication. Do not infer extra abilities from a package name such as Business or Scale.

## 18. TulisAI communication findings

**Observed public exposure:** not present on homepage stage or Produk listing; `/produk/tulisai` 404. No TulisAI menu/footer item observed. This is consistent with V1 deferral, within the inspected public surfaces. It is not a database-wide proof that every unlinked slug is absent.

**State:** first-party MKL on roadmap. B0–B4 source/merge progress is not commercial availability, commissioning, Sandbox readiness, Production readiness, or publication approval.

**Recommendation:** retain no launch marketing exposure. Keep M1 §33 copy as future research input. Public name/domain and capability truth must be settled when that release is actually ready. No invented price, free trial, user count, feature list, buy CTA, waitlist database, or partner badge.

## 19. Market handoff findings

**Where Main links:** header, mobile navigation source, homepage hero/pathway/Market block/eight categories, footer, compatibility notices, and currently product breadcrumb. Footer search adds another path to the same destination.

**Good:** core data queries separate Main portfolio/classes from Market placement. Market copy identifies publisher brands. Compatibility notices do not duplicate Market inventory.

**Needs work:** Main repeats empty Market paths; Mari Rekap breadcrumb points at Market; obsolete Kerja Sama copy uses Etalase/Growth; Market meta description still mentions classes despite Main Kelas ownership. The last item is recorded only because it affects visitor expectations at the handoff, not as a Market redesign task.

**Target:** one clear Market nav/footer path and concise contextual homepage explanation. Preserve actual resolver behavior. Do not hardcode a separate hostname until commissioning enables it. Do not let first-party cards become partner inventory or replace publisher identity with MKL ownership. Internal non-SaaS products may still belong to Market under their own publisher/brand per SoT; avoid claiming every Market item is third-party-owned if that would exclude the supported internal non-SaaS case.

## 20. Genuine owner decisions required

| Decision | Why unresolved | Smallest useful input | Not being reopened |
|---|---|---|---|
| Which B2B service families can be offered now? | Marketing describes portfolio, not staffed capacity/readiness | Ready / inquiry-only / later for five rows | Custom B2B positioning already locked |
| Who follows up on intake, and what may be promised? | Storage/inbox exist; assignment/SLA not established in inspected source | Responsible owner and truthful follow-up wording | Existing intake seam stays |
| Final customer-facing refund/policy wording | Published seven-day/trial copy vs current business intent and correction infrastructure | Approved policy text and operative version | No absolute no-refund invented |
| Public legal/operator and contact commitments | Publisher identity is not legal entity; hours are visible but operational proof absent | Approved identity, hours, contact responsibilities | Product ownership already locked |
| About people/history if wanted | No approved founder/team chronology found in inspected authority | Facts and publication consent | Minimum factual About does not wait for biography |
| Curation/testing claim scope | Review/publish workflow does not prove every advertised testing claim | Actual methodology or permission to remove claim | No fabricated proof |

Not owner questions: whether TulisAI belongs to V1 (it does not); whether Mari Rekap is first-party (it is); whether B2B must end in SaaS (it must not); whether to keep Main/Market separation (locked); whether to invent class/Insight inventory (never); whether to create a second lead database (no evidence requires it).

No need to ask the owner to choose every CTA. Recommended truthful copy directions in §9 can proceed into a draft. Insight timing is a future editorial release decision after capability/content exists, not an urgent launch ambiguity.

## 21. Direct design/content team handoff

| Page | Route | Audience | Job | Recommended sections | Recommended H1 | Lead direction | Primary CTA | Secondary CTA | Trust requirement | Data dependency | SEO requirement | Launch priority | Owner decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Home | `/` | Workers/teams | Choose path | Hero; need paths; real product; team needs; role clarity optional | Kerja lebih beres, mulai dari kebutuhanmu. | Concrete products/learning/team needs | Lihat produk MKL | Bahas kebutuhan tim after page ready | No fake scale | Published inventory/status | New title/description/OG, self canonical | P0 truth; P1 rewrite | No routine decision |
| Produk | `/produk-kami` | Software users | Select first-party | Intro; actual product; special needs optional | Produk MKL untuk pekerjaan nyata. | Manual-work benefit | Kenali Mari Rekap | B2B optional | Produk dari MKL | Portfolio summary | Include sitemap; truthful metadata | P0 | Capability approval |
| Product detail | `/produk/mari-rekap` | Recap users | Understand/use | Value; fit; workflow; current capabilities; limits; offer/access; FAQ optional | Mari Rekap — bantu susun rekap, tetap kamu yang periksa. | Reviewable table output | State-specific approved access / explanatory anchor | Contact | Human review and limits | Body, offer, application contract | One canonical, description, OG, truthful SoftwareApplication | P0 | Public capability list |
| Kelas | `/kelas` | Learners | See real availability | Premise; empty or inventory; class facts | Belajar untuk pekerjaan yang kamu hadapi. | Practical topics | Usulkan topik kelas while empty | — | No invented instructor/schedule | Real class/session | Self; no Course/Event while empty | P0 truth; P1 copy | Real class commissioning later |
| B2B | `/untuk-bisnis` | Owners/managers | Evaluate custom help | Nine focused sections in §15; merge repetition | Solusi kerja yang berangkat dari kebutuhan tim. | Workflow first, scoped help | Bahas kebutuhan tim | Lihat bentuk bantuan | Method, boundaries; no fake cases | Service readiness and follow-up | New real route, intent metadata, sitemap after ready | P0 | Services ready now |
| Intake | `/ajukan-kebutuhan` | Qualified inquiries | Explain need | Context; short form; confirmation | Ceritakan pekerjaan yang ingin kamu bereskan. | Process + obstacle + outcome | Kirim kebutuhan | Privacy/contact | Accurate data/follow-up commitments | Existing product_requests | Prefer operational noindex | P1; preserve P0 handoff | Follow-up owner |
| Partner | `/untuk-partner` | Builders | Qualify/register | Proposition; fit; relationship; approval path; terms | Punya produk yang membantu pekerjaan orang lain? | Publisher brand preserved | Mulai pengajuan partner | Tanya soal kemitraan | No sales promise | Approval/commissioning state | Marketing indexed only at release; workspace noindex | P0 truth; P1 copy | Ready distribution terms |
| Tentang | `/tentang` | Visitors | Understand MKL | Identity; roles; principles/contact; people optional | Mengenal MKL. | Facts, not founder mythology | Lihat produk MKL | Hubungi MKL | Verified ownership/claims | Published CMS | Fill metadata; same Organization identity | P0 | Optional story/claims |
| Market handoff | Resolved entry | Discoverers | Reach separate surface | Label + role + current availability | Jelajahi produk dari para penerbit. | Publisher ownership | Buka Market | — | No inventory guarantee | Resolver, actual supply | Surface-specific canonical/map | P0 | Activation separate, not content task |
| Kontak | `/kontak` | Support/inquiry | Reach correct channel | Contact; issue triage | Hubungi tim MKL. | Product/order vs team need | Kirim email | Ceritakan kebutuhan | Hours/SLA only approved | Actual channel | Fill description/links | P1 | Hours/ownership |
| Compatibility | Three legacy pages + redirects | Old traffic | Recover destination | Brief orientation/notice | Specific destination | No architecture lecture | Correct real destination | — | No obsolete businesses | Resolver/CMS | Omit thin pages from launch sitemap | P0 stale cleanup | None for obvious redirects/links |
| Legal | Three policy URLs | Users/buyers | Understand policies | Scope; terms; limits; contact/version | Descriptive existing titles | Factual commitments | Policy help/contact | Cross-policy links | Approved policy | Policy owner facts | Unique descriptions/self; deliberate index policy | P0 | Approved wording |
| Insight/TulisAI | Future only | Future audiences | Not launch content | None published now | None required now | Future research | None | None | Capability before claim | Missing/deferred | No premature URLs/schema | FUTURE | Later release decisions |

This handoff defines content sequence and purpose, not page layout or visual hierarchy styling. Designers retain all visual decisions.

## 22. Implementation/content risks and audit exception

| Risk | Evidence | Required guardrail |
|---|---|---|
| Fake inventory/social proof | Kelas/Market empty; only Mari Rekap on portfolio | Never populate with sample products/classes/testimonials/logos/metrics |
| Premature commerce | A4 offer publication, payment not open | Publication, pricing, access, checkout, provider verification remain distinct |
| Main/Market conflation | Mari Rekap breadcrumb and generic distribution line | Placement-aware ownership text and links |
| Partner/B2B conflation | Legacy Kerja Sama and shared generic inquiry | Separate explanatory pages, same operational intake when useful |
| Future capability as current | Track B/D progress vs public marketing | Product claim checklist per released capability |
| Unsupported trust/policy claims | About/testing, refund/trial copy | Owner-approved facts; no automatic legal-policy invention |
| Compatibility becomes primary IA | Footer + sitemap legacy notices | Keep URLs but remove promotional prominence |
| Dead CTA | `/apps/marirekap` 404 | Resolve approved application path, not slug guessing |
| Duplicate content intent | Repeated home pathways; footer search/Market; Kerja Sama | Consolidate explanations; do not create extra thin pages |
| Text density | Home explains architecture repeatedly | One idea per section; detail on appropriate page |
| Insight surfaced too early | `/insight` 404; no dedicated model/router | No primary nav until real owned hub exists |
| Product copy data invisible | `not_for` declared but not rendered; summary not detail fallback | Verify intended fields actually appear |
| Class details incomplete | Generic product detail lacks class projection | Before first class promotion, show actual class facts safely |
| Search metadata defects | Duplicate canonical, omissions, 60-row cap, `/apps` gap | Fix before indexing activation; no flag mutation in audit |
| GET can mutate app state | Hitungin loader calls resolveWorkspace → createGuestWorkspace | Do not include legacy app in crawler/content QA without understanding loader side effects |

**Audit exception, exact scope:** one anonymous GET to `https://marikitalembur.com/apps/hitungin` returned 200. The inspected source path calls `resolveWorkspace`; without a valid workspace cookie it calls `createGuestWorkspace`, which inserts an organization, product workspace, and an available trial. The request used no reused web session. Thus a server-side guest-state mutation is **likely**, even though no POST was sent. Production rows, identifiers, and counts were not inspected, so the report does not assert exact inserted IDs or claim a verified cleanup. No calculation, payment, checkout, lead form, or partner registration was submitted. No attempt was made to undo this through additional writes.

This was an unintended departure from the requested runtime-read-only boundary. It does not justify further mutations. It is explicitly reported instead of providing a false “NONE” confirmation.

## 23. Exact recommended next step and final confirmation

**Smallest follow-up:** create one launch content draft and claim register for the existing redesign team, covering Home, Produk, Mari Rekap detail, Kelas empty state, B2B parent page, Partner, Tentang, and stale supporting copy. Use this report’s recommended sections/CTAs. Resolve only the genuine service/policy facts in §20. In a separately scoped engineering correction, fix the Mari Rekap access destination and metadata defects; do not treat this report as authorization to implement, publish, change flags, or activate payments.

Draft acceptance: every page has a clear audience/job, concise value statement, correct first-party/partner identity, supported capability/status, real destination, and metadata tied to actual content. Do not add Insight, TulisAI, Expert booking, service subpages, or a second intake system to that smallest follow-up.

| Confirmation | Actual result |
|---|---|
| Repository/source files modified | **NONE** |
| Existing local/source/package files modified | **NONE** |
| Audit deliverable | New report file only in task `outputs/` |
| Commits | **NONE** |
| PR | **NONE** |
| Deployment | **NONE** |
| CMS/catalog/redirect/sitemap/robots/canonical/flag edits | **NONE** |
| Runtime mutation | **Cannot certify NONE: one GET likely created Hitungin guest organization/workspace/trial; see §22** |
| Payment/provider operation | **NONE** |
| Lead form/partner registration/calculation submissions | **NONE** |
| Product transaction or checkout test | **NONE** |

Audit stops at this report. No recommended change has been implemented.


## Appendix A. Complete registered route-pattern manifest

Source: `apps/web/app/routes.ts` at the inspected SHA. This is a source inventory, not a statement that each pattern is publicly accessible or has a production data instance. Layout files and components are not extra public pages. Main/Market host rules and guards still apply. No hidden/action route is an invitation to invoke it. The Control parent and its index are listed separately as router registrations, not counted as two public pages.

| Registered pattern | Route module | Content IA classification |
|---|---|---|
| `/api/health` | `routes/api.health.ts` | RESOURCE / ACTION — not a content page |
| `/api/hitungin/calculate` | `routes/api.hitungin.calculate.ts` | RESOURCE / ACTION — not a content page |
| `/api/orders/:orderId/status` | `routes/api.orders.$orderId.status.ts` | RESOURCE / ACTION — not a content page |
| `/media/*` | `routes/media.$.ts` | RESOURCE / ACTION — not a content page |
| `/robots.txt` | `routes/robots.ts` | CRAWLER RESOURCE |
| `/sitemap.xml` | `routes/sitemap.ts` | CRAWLER RESOURCE |
| `/preferensi/tema` | `routes/preferensi.tema.ts` | RESOURCE / ACTION — not a content page |
| `/auth/google/callback` | `routes/auth.google.callback.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/auth/magic` | `routes/auth.magic.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/auth/magic/konfirmasi` | `routes/auth.magic.konfirmasi.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/.well-known/openid-configuration` | `routes/wellknown.openid-configuration.ts` | RESOURCE / ACTION — not a content page |
| `/.well-known/jwks.json` | `routes/wellknown.jwks.ts` | RESOURCE / ACTION — not a content page |
| `/sso/authorize` | `routes/sso.authorize.tsx` | RESOURCE / ACTION — not a content page |
| `/sso/token` | `routes/sso.token.ts` | RESOURCE / ACTION — not a content page |
| `/sso/userinfo` | `routes/sso.userinfo.ts` | RESOURCE / ACTION — not a content page |
| `/sso/introspect` | `routes/sso.introspect.ts` | RESOURCE / ACTION — not a content page |
| `/sso/logout` | `routes/sso.logout.ts` | RESOURCE / ACTION — not a content page |
| `/app/v1/:resource` | `routes/app.v1.$resource.ts` | RESOURCE / ACTION — not a content page |
| `/connect/authorize` | `routes/connect.authorize.tsx` | RESOURCE / ACTION — not a content page |
| `/connect/token` | `routes/connect.token.tsx` | RESOURCE / ACTION — not a content page |
| `/partner/v1/activations/:operation` | `routes/partner.activations.ts` | RESOURCE / ACTION — not a content page |
| `/file/:token` | `routes/file.$token.tsx` | RESOURCE / ACTION — not a content page |
| `/go/:itemId` | `routes/go.$itemId.tsx` | RESOURCE / ACTION — not a content page |
| `/__test/seed-hitungin` | `routes/test.seed-hitungin.ts` | HIDDEN — development seam; never public content |
| `/__test/seed-product` | `routes/test.seed-product.ts` | HIDDEN — development seam; never public content |
| `/__test/seed-order` | `routes/test.seed-order.ts` | HIDDEN — development seam; never public content |
| `/__test/seed-sso-app` | `routes/test.seed-sso-app.ts` | HIDDEN — development seam; never public content |
| `/__test/midtrans-notify` | `routes/test.midtrans-notify.ts` | HIDDEN — development seam; never public content |
| `/__test/seed-entitlement` | `routes/test.seed-entitlement.ts` | HIDDEN — development seam; never public content |
| `/__test/seed-class-ticket` | `routes/test.seed-class-ticket.ts` | HIDDEN — development seam; never public content |
| `/__test/foundation` | `routes/test.foundation.tsx` | HIDDEN — development seam; never public content |
| `/__test/stage` | `routes/test.stage.tsx` | HIDDEN — development seam; never public content |
| `/__test/explore-tools` | `routes/test.explore-tools.tsx` | HIDDEN — development seam; never public content |
| `/` | `routes/home.tsx` | PUBLIC MAIN |
| `/jelajahi` | `routes/jelajahi.tsx` | MARKET — separate semantic surface, same-origin fallback observed |
| `/cari` | `routes/cari.tsx` | COMPATIBILITY / REDIRECT |
| `/kategori/:slug` | `routes/kategori.$slug.tsx` | COMPATIBILITY / REDIRECT |
| `/produk/:slug` | `routes/produk.$slug.tsx` | DYNAMIC DETAIL — published row + placement decide owner |
| `/apps/hitungin` | `routes/apps.hitungin.tsx` | HIDDEN / COMPATIBILITY |
| `/produk-kami` | `routes/produk-kami.tsx` | PUBLIC MAIN — see per-page audit |
| `/kelas` | `routes/kelas.tsx` | PUBLIC MAIN — see per-page audit |
| `/starter-kit` | `routes/starter-kit.tsx` | COMPATIBILITY / REDIRECT |
| `/website-saas` | `routes/website-saas.tsx` | COMPATIBILITY / REDIRECT |
| `/untuk-partner` | `routes/untuk-partner.tsx` | PUBLIC MAIN — see per-page audit |
| `/ajukan-kebutuhan` | `routes/ajukan-kebutuhan.tsx` | PUBLIC MAIN — see per-page audit |
| `/checkout/:offerId` | `routes/checkout.$offerId.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/review-checkout/:token` | `routes/review-checkout.$token.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/pembayaran/:orderId` | `routes/pembayaran.$orderId.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/masuk` | `routes/masuk.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/keluar` | `routes/keluar.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/produk-saya` | `routes/produk-saya.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/pesanan` | `routes/pesanan.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/pesanan/:orderId` | `routes/pesanan.$orderId.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/unduh/:artifactId` | `routes/unduh.$artifactId.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/akun` | `routes/akun.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/partner` | `routes/partner.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/partner/:orgId` | `routes/partner.$orgId.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/partner/:orgId/produk/:itemId` | `routes/partner.$orgId.produk.$itemId.tsx` | UTILITY / PRIVATE / TRANSACTIONAL — no acquisition IA |
| `/:slug` | `routes/page.$slug.tsx` | DYNAMIC CMS — published row required; unlinked rows not enumerated |
| `/control` | `routes/control/layout.tsx` | INTERNAL — operator |
| `/control` (index) | `routes/control/dashboard.tsx` | INTERNAL — operator |
| `/control/products` | `routes/control/products.tsx` | INTERNAL — operator |
| `/control/products/new` | `routes/control/product-new.tsx` | INTERNAL — operator |
| `/control/products/:id` | `routes/control/product-edit.tsx` | INTERNAL — operator |
| `/control/brands` | `routes/control/brands.tsx` | INTERNAL — operator |
| `/control/categories` | `routes/control/categories.tsx` | INTERNAL — operator |
| `/control/classes` | `routes/control/classes.tsx` | INTERNAL — operator |
| `/control/pages` | `routes/control/pages.tsx` | INTERNAL — operator |
| `/control/pages/:id` | `routes/control/page-edit.tsx` | INTERNAL — operator |
| `/control/commerce` | `routes/control/commerce.tsx` | INTERNAL — operator |
| `/control/applications` | `routes/control/applications.tsx` | INTERNAL — operator |
| `/control/settings` | `routes/control/settings.tsx` | INTERNAL — operator |
| `/control/reviewers` | `routes/control/reviewers.tsx` | INTERNAL — operator |
| `/control/payments` | `routes/control/payments.tsx` | INTERNAL — operator |
| `/control/smoke` | `routes/control/smoke.tsx` | INTERNAL — operator |
| `/control/refunds` | `routes/control/refunds.tsx` | INTERNAL — operator |
| `/control/listings` | `routes/control/listings.tsx` | INTERNAL — operator |
| `/control/team` | `routes/control/team.tsx` | INTERNAL — operator |
| `/control/audit` | `routes/control/audit.tsx` | INTERNAL — operator |
| `/control/kebutuhan` | `routes/control/kebutuhan.tsx` | INTERNAL — operator |
| `/control/publishers` | `routes/control/publishers.tsx` | INTERNAL — operator |
| `/control/partners` | `routes/control/partners.tsx` | INTERNAL — operator |
| `/control/submissions` | `routes/control/submissions.tsx` | INTERNAL — operator |
