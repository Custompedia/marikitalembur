# MKL Main — Handoff untuk Tim Redesign & Konten

Tanggal: 23 September 2026.
Repository: Custompedia/MKL-Website.
Branch: claude/mkl-gates-0-3-qcwjyk.
Baseline source: 2306511a5488c1cc9f283698976f77a891634837.

File ini memisahkan handoff dari laporan audit agar dapat dipakai langsung oleh tim. Isinya rekomendasi untuk draft berikutnya, bukan perubahan yang sudah diimplementasikan. Status situs adalah observasi saat audit, bukan jaminan bahwa keadaan tetap sama setelah tanggal tersebut.

## Ruang lingkup dan batas

- Kerjakan informasi, urutan konten, copy, hubungan rute, CTA, dan kebutuhan metadata. Semua keputusan visual tetap milik tim desain.
- Repository/business SoT menentukan fakta produk, ownership, rilis, dan commerce. Marketing playbook menentukan arah; contoh kalimatnya boleh diperbaiki.
- MKL adalah parent brand. Mari Rekap adalah first-party dan satu-satunya SaaS dalam current Release V1/payment candidate. TulisAI tetap di luar V1.
- Produk first-party, Market, dan B2B memiliki peran berbeda. Market tetap surface terpisah; tujuan tautannya mengikuti resolver dan commissioning yang nyata.
- Untuk Bisnis adalah pekerjaan custom sesuai kebutuhan tim, bukan funnel wajib menuju SaaS MKL.
- Gunakan Ajukan Kebutuhan sebagai intake existing. Jangan membuat database lead kedua.
- Jangan menambahkan inventaris, testimoni, logo klien, metrik, case study, harga, SLA, atau kemampuan produk yang tidak didukung evidence.
- Insight, Expert booking, TulisAI komersial, dan Mari Rekap vNext tidak dipromosikan sebagai kemampuan saat ini.
- Semua suggested copy adalah COPY EXPLORATION. Klaim kemampuan dan komitmen operasional perlu cocok dengan evidence sebelum dipublikasikan.

## Prioritas sebelum launch konten

1. Lengkapi ringkasan dan detail Mari Rekap: manfaat, pengguna, alur, kemampuan saat ini, batas, serta status akses/pembayaran.
2. Perbaiki CTA akses Mari Rekap yang teramati menuju `/apps/marirekap` (404). Ini membutuhkan koreksi engineering sesuai kontrak aplikasi, bukan hanya label baru.
3. Siapkan `/untuk-bisnis` dengan perjalanan konten utuh dan CTA ke `/ajukan-kebutuhan`; jangan memasang nav sebelum destination tersedia.
4. Hapus framing Etalase/Growth sebagai jalur bisnis mandiri dari copy `/kerja-sama`.
5. Rekonsiliasi klaim Tentang dan kebijakan trial/refund/pembayaran bersama pemilik fakta dan kebijakan.
6. Pertahankan empty state Kelas/Market yang jujur serta batas produk yang belum dirilis.
7. Lengkapi metadata dan perbaiki canonical/sitemap sebelum indexing diaktifkan melalui keputusan rilis terpisah. Jangan mengubah flag sebagai bagian draft konten.

## Tabel handoff per halaman

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

## Keputusan owner yang masih diperlukan

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

## Acceptance untuk draft berikutnya

- Setiap halaman menjawab siapa penggunanya, pekerjaan apa yang dibantu, dan langkah berikutnya.
- Copy singkat, natural, dan berbahasa Indonesia; penjelasan mendalam ditempatkan pada halaman yang tepat.
- Setiap CTA menuju halaman atau alur yang nyata, sesuai intent dan status akses.
- Publication, implemented, deployed, commissioned, publicly enabled, commercially active, dan provider verified tidak disamakan.
- Harga tidak menyiratkan checkout sudah dibuka. Akses existing tidak disamakan dengan akses semua pengunjung.
- Tidak ada link Insight/TulisAI/layanan turunan yang belum tersedia.
- Tidak ada perubahan billing, entitlement, runtime, katalog, atau feature flag yang diselundupkan sebagai pekerjaan copy.

## Referensi lengkap

Lihat laporan pendamping `MKL_MAIN_CONTENT_IA_AUDIT_2026-09-23.md`:

- Bagian 8: section-by-section content architecture dan suggested copy.
- Bagian 9: alternatif H1, lead, dan CTA serta evaluasinya.
- Bagian 10: CTA map dan masalah destination.
- Bagian 12: audit SEO/metadata dan target per halaman.
- Bagian 13: backlog P0/P1/P2/FUTURE.
- Bagian 15: pendalaman Untuk Bisnis dan lima keluarga layanan.
- Bagian 22: risiko dan pengecualian audit read-only.

Catatan QA: jangan membuka ulang `/apps/hitungin` untuk smoke test konten tanpa meninjau efek samping loader. Satu GET saat audit kemungkinan membuat guest organization/workspace/trial; tidak ada form, kalkulasi, atau pembayaran yang dikirim. Rincian ada pada laporan lengkap.

Handoff ini tidak mengotorisasi implementasi, publikasi, deployment, aktivasi indexing, ataupun pembayaran.
