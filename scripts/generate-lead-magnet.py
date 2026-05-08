"""
Generates the lead-magnet PDF "Les 5 erreurs qui pénalisent vos campagnes Meta Ads".
Output: public/guides/5-erreurs-meta-ads.pdf

Run: python scripts/generate-lead-magnet.py
"""

from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

OUT = Path(__file__).resolve().parent.parent / "public" / "guides" / "5-erreurs-meta-ads.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

# Brand colors
DARK = HexColor("#0A0A0A")
PANEL = HexColor("#111111")
BRAND = HexColor("#0066FF")
BRAND_SOFT = HexColor("#1F3A6A")
TEXT = HexColor("#FFFFFF")
MUTED = HexColor("#9CA3AF")
DIVIDER = HexColor("#1F1F23")

W, H = A4
MARGIN = 22 * mm

c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle("Les 5 erreurs qui pénalisent vos campagnes Meta Ads")
c.setAuthor("Omonlola")
c.setSubject("Guide stratégique Meta Ads")
c.setCreator("Omonlola")


def fill_background():
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def header(page_num: int, total: int):
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN, H - 12 * mm, "OMONLOLA · MEDIA BUYER · META ADS")
    c.drawRightString(W - MARGIN, H - 12 * mm, f"PAGE {page_num} / {total}")
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(0.5)
    c.line(MARGIN, H - 14 * mm, W - MARGIN, H - 14 * mm)


def footer():
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(0.5)
    c.line(MARGIN, 14 * mm, W - MARGIN, 14 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(MARGIN, 9 * mm, "© Omonlola · Tous droits réservés.")
    c.drawRightString(W - MARGIN, 9 * mm, "omonlolaagossou.com")


def text_block(x, y, lines, leading=14, font="Helvetica", size=10, color=TEXT):
    c.setFillColor(color)
    c.setFont(font, size)
    for i, line in enumerate(lines):
        c.drawString(x, y - i * leading, line)


def wrap(text: str, max_chars: int):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        if len(cur) + len(w) + 1 > max_chars:
            lines.append(cur.strip())
            cur = w
        else:
            cur += " " + w
    if cur.strip():
        lines.append(cur.strip())
    return lines


def page_cover():
    fill_background()
    # Brand glow
    c.setFillColor(BRAND_SOFT)
    c.circle(W * 0.15, H * 0.15, 90 * mm, stroke=0, fill=1)
    c.setFillColor(DARK)
    c.rect(0, 0, W, H * 0.5, fill=1, stroke=0)

    # Tag
    c.setStrokeColor(BRAND)
    c.setLineWidth(0.6)
    c.roundRect(MARGIN, H - 60 * mm, 70 * mm, 9 * mm, 4, stroke=1, fill=0)
    c.setFillColor(BRAND)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(MARGIN + 5 * mm, H - 60 * mm + 3 * mm, "RESSOURCE GRATUITE · 2026")

    # Title
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(MARGIN, H - 80 * mm, "Les 5 erreurs qui")
    c.drawString(MARGIN, H - 92 * mm, "pénalisent vos")
    c.setFillColor(BRAND)
    c.drawString(MARGIN, H - 104 * mm, "campagnes Meta Ads.")

    # Subtitle
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 11)
    sub = (
        "Le guide stratégique pour annonceurs e-commerce et SaaS qui veulent "
        "arrêter de brûler leur budget publicitaire et rebâtir un ROAS rentable, "
        "mesurable et tenable dans la durée."
    )
    for i, line in enumerate(wrap(sub, 65)):
        c.drawString(MARGIN, H - 125 * mm - i * 14, line)

    # Author block
    c.setFillColor(PANEL)
    c.roundRect(MARGIN, 28 * mm, W - 2 * MARGIN, 28 * mm, 6, stroke=0, fill=1)
    c.setFillColor(BRAND)
    c.circle(MARGIN + 14 * mm, 42 * mm, 7 * mm, stroke=0, fill=1)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(MARGIN + 28 * mm, 46 * mm, "Omonlola Agossou")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 9)
    c.drawString(MARGIN + 28 * mm, 38 * mm, "Media Buyer · Meta Ads Specialist · 7+ ans d'expertise")
    c.drawString(MARGIN + 28 * mm, 32 * mm, "omonlolaagossou.com")

    c.showPage()


def page_intro(total):
    fill_background()
    header(2, total)
    footer()

    c.setFillColor(BRAND)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, H - 30 * mm, "INTRODUCTION")

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(MARGIN, H - 42 * mm, "80% du budget Meta")
    c.drawString(MARGIN, H - 54 * mm, "est gaspillé. Souvent")
    c.drawString(MARGIN, H - 66 * mm, "à cause de 5 erreurs.")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10.5)
    intro = (
        "Depuis l'iOS 14.5, l'arrivée d'Advantage+, l'inflation des CPM "
        "et la maturité croissante de l'algorithme Meta, les règles du jeu ont "
        "changé. Les campagnes qui marchaient en 2022 ne marchent plus aujourd'hui. "
        "Pourtant, la majorité des annonceurs continue d'appliquer les mêmes "
        "réflexes — et de payer cher leurs erreurs."
    )
    y = H - 82 * mm
    for line in wrap(intro, 75):
        c.drawString(MARGIN, y, line)
        y -= 14

    intro2 = (
        "Ce guide décortique les 5 erreurs qui coûtent le plus de ROAS "
        "aux annonceurs en 2026, basées sur l'audit de plus de 200 comptes "
        "Meta Ads. Pour chaque erreur, vous trouverez : le diagnostic, "
        "les conséquences chiffrées, et la méthode pour corriger."
    )
    y -= 6
    for line in wrap(intro2, 75):
        c.drawString(MARGIN, y, line)
        y -= 14

    # Sommaire
    c.setFillColor(BRAND)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, y - 18, "AU SOMMAIRE")
    y -= 32

    items = [
        ("01", "Cibler trop large (ou trop étroit)", "p. 3"),
        ("02", "Tracking & CAPI mal configurés", "p. 5"),
        ("03", "Créatives faibles ou peu renouvelées", "p. 7"),
        ("04", "Scaler trop vite, casser l'algorithme", "p. 9"),
        ("05", "Aucune analyse post-campagne", "p. 11"),
    ]
    for num, label, page in items:
        c.setFillColor(BRAND)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(MARGIN, y, num)
        c.setFillColor(TEXT)
        c.setFont("Helvetica", 11)
        c.drawString(MARGIN + 14 * mm, y, label)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9)
        c.drawRightString(W - MARGIN, y, page)
        y -= 16

    c.showPage()


def section_title_page(num, page_num, total, kicker, title, body, cost_label, cost_value):
    fill_background()
    header(page_num, total)
    footer()

    # Big number background
    c.setFillColor(BRAND_SOFT)
    c.setFont("Helvetica-Bold", 200)
    c.drawString(W - 90 * mm, H - 80 * mm, num)

    c.setFillColor(BRAND)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, H - 30 * mm, kicker)

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 24)
    title_lines = wrap(title, 26)
    y = H - 46 * mm
    for line in title_lines:
        c.drawString(MARGIN, y, line)
        y -= 28

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10.5)
    body_lines = wrap(body, 75)
    y -= 8
    for line in body_lines:
        c.drawString(MARGIN, y, line)
        y -= 14

    # Cost callout
    c.setFillColor(PANEL)
    c.roundRect(MARGIN, 38 * mm, W - 2 * MARGIN, 24 * mm, 6, stroke=0, fill=1)
    c.setStrokeColor(BRAND)
    c.setLineWidth(2)
    c.line(MARGIN + 2, 38 * mm + 2, MARGIN + 2, 38 * mm + 24 * mm - 2)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(MARGIN + 8 * mm, 54 * mm, cost_label)
    c.setFillColor(BRAND)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(MARGIN + 8 * mm, 44 * mm, cost_value)

    c.showPage()


def section_solution_page(page_num, total, kicker, title, intro, bullets):
    fill_background()
    header(page_num, total)
    footer()

    c.setFillColor(BRAND)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, H - 30 * mm, kicker)

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(MARGIN, H - 44 * mm, title)

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10.5)
    y = H - 60 * mm
    for line in wrap(intro, 75):
        c.drawString(MARGIN, y, line)
        y -= 14

    y -= 8
    for i, b in enumerate(bullets, start=1):
        # Bullet pill
        c.setFillColor(BRAND)
        c.circle(MARGIN + 3 * mm, y + 3, 2.6 * mm, stroke=0, fill=1)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(MARGIN + 3 * mm, y + 1, str(i))

        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(MARGIN + 10 * mm, y + 4, b["title"])

        c.setFillColor(MUTED)
        c.setFont("Helvetica", 10)
        body_lines = wrap(b["body"], 70)
        sub_y = y - 8
        for line in body_lines:
            c.drawString(MARGIN + 10 * mm, sub_y, line)
            sub_y -= 12
        y = sub_y - 10

    c.showPage()


def page_conclusion(page_num, total):
    fill_background()
    header(page_num, total)
    footer()

    # Glow
    c.setFillColor(BRAND_SOFT)
    c.circle(W * 0.85, H * 0.6, 70 * mm, stroke=0, fill=1)
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=0, stroke=0)

    c.setFillColor(BRAND)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, H - 30 * mm, "ET MAINTENANT ?")

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 26)
    c.drawString(MARGIN, H - 48 * mm, "Vous savez où ça")
    c.drawString(MARGIN, H - 60 * mm, "saigne. Reste à")
    c.setFillColor(BRAND)
    c.drawString(MARGIN, H - 72 * mm, "stopper l'hémorragie.")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 11)
    body = (
        "Si vous reconnaissez 2 erreurs ou plus dans votre compte Meta, "
        "vous laissez probablement filer entre 30% et 60% de votre budget chaque mois. "
        "La bonne nouvelle : ces 5 erreurs sont toutes réversibles en 30 jours, "
        "à condition d'avoir un diagnostic précis et un plan d'action ordonné."
    )
    y = H - 92 * mm
    for line in wrap(body, 70):
        c.drawString(MARGIN, y, line)
        y -= 14

    # CTA card
    c.setFillColor(PANEL)
    c.roundRect(MARGIN, 50 * mm, W - 2 * MARGIN, 50 * mm, 8, stroke=0, fill=1)
    c.setStrokeColor(BRAND)
    c.setLineWidth(1)
    c.roundRect(MARGIN, 50 * mm, W - 2 * MARGIN, 50 * mm, 8, stroke=1, fill=0)

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(MARGIN + 8 * mm, 88 * mm, "Audit Meta Ads gratuit (45 min)")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10)
    cta_body = (
        "Je revois votre Business Manager en direct, j'identifie vos 3 plus grosses fuites "
        "et je vous remets un plan d'action chiffré. Sans engagement."
    )
    y = 78 * mm
    for line in wrap(cta_body, 75):
        c.drawString(MARGIN + 8 * mm, y, line)
        y -= 12

    c.setFillColor(BRAND)
    c.roundRect(MARGIN + 8 * mm, 56 * mm, 70 * mm, 11 * mm, 5, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(MARGIN + 8 * mm + 35 * mm, 60 * mm, "RÉSERVER MON AUDIT →")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 9)
    c.drawString(MARGIN + 86 * mm, 60 * mm, "omonlolaagossou.com/#contact")

    c.showPage()


# Build the document (12 pages total)
TOTAL = 12

# 1. Cover
page_cover()

# 2. Intro
page_intro(TOTAL)

# 3-4. Erreur 1 — Cibler trop large
section_title_page(
    "1", 3, TOTAL,
    "ERREUR N°1 · CIBLAGE",
    "Cibler trop large — ou trop étroit.",
    "L'arrivée d'Advantage+ et de l'IA d'apprentissage automatique a "
    "renversé les règles du ciblage. Continuer à empiler 15 audiences "
    "détaillées en 2026, c'est handicaper l'algorithme. À l'inverse, "
    "tout laisser ouvert sans signal, c'est se brûler sur des audiences "
    "non qualifiées.",
    "COÛT MOYEN OBSERVÉ", "+38% de CPA · -22% de ROAS",
)
section_solution_page(
    4, TOTAL,
    "ERREUR N°1 · MÉTHODE",
    "La doctrine de ciblage 2026.",
    "Le bon ciblage Meta aujourd'hui repose sur 3 piliers : un signal "
    "de conversion propre côté pixel, une seule audience large par "
    "campagne d'acquisition, et des audiences custom uniquement pour "
    "le retargeting chaud.",
    [
        {"title": "Une seule Advantage+ pour l'acquisition",
         "body": "Pas 4. Pas 12. Une seule. Plus le budget est concentré, plus l'algorithme apprend vite et trouve votre acheteur cible."},
        {"title": "Audiences détaillées : uniquement en seed",
         "body": "Servez-vous-en pour entraîner Advantage+, mais ne lancez pas 18 ad sets segmentés en parallèle. Vous fragmentez l'apprentissage."},
        {"title": "Retargeting tiering 7/30/180",
         "body": "Trois windows distinctes : visiteurs récents (chauds), abandons panier (très chauds), acheteurs anciens (cross-sell). Pas de mélange."},
    ],
)

# 5-6. Erreur 2 — Tracking
section_title_page(
    "2", 5, TOTAL,
    "ERREUR N°2 · TRACKING",
    "CAPI absent ou mal configuré.",
    "Depuis iOS 14.5, le pixel seul perd entre 30% et 50% des "
    "conversions. La Conversion API (CAPI) côté serveur est devenue "
    "non-négociable. Pourtant 1 compte sur 2 que j'audite tourne encore "
    "sans CAPI ou avec un déduplication cassée. Résultat : Meta optimise "
    "à l'aveugle.",
    "COÛT MOYEN OBSERVÉ", "-35% de signal · +50% de CPA",
)
section_solution_page(
    6, TOTAL,
    "ERREUR N°2 · MÉTHODE",
    "Stack tracking propre et déduplication.",
    "Un signal Meta solide repose sur 4 briques. Chaque brique manquante "
    "dégrade votre coût d'acquisition. La règle d'or : event_id partagé "
    "entre pixel et CAPI sur chaque conversion clé.",
    [
        {"title": "CAPI Gateway ou Stape (côté serveur)",
         "body": "Mettez la conversion en serveur, pas en navigateur. iOS, AdBlock, mode privé : tout est récupéré. Gain typique : +25% de signal."},
        {"title": "Match quality > 7/10",
         "body": "Email hashé, téléphone hashé, fbp/fbc présent, IP, user-agent. Plus le match est fort, plus Meta attribue correctement."},
        {"title": "Déduplication par event_id",
         "body": "Pixel et CAPI doivent envoyer le même event_id pour chaque conversion. Sans ça, Meta compte 2 fois et casse la mesure."},
    ],
)

# 7-8. Erreur 3 — Créatives
section_title_page(
    "3", 7, TOTAL,
    "ERREUR N°3 · CRÉATIVES",
    "Créatives faibles ou peu renouvelées.",
    "85% du résultat d'une campagne Meta vient aujourd'hui de la "
    "créative. Pas du ciblage, pas du bid, pas de la structure. Pourtant "
    "la majorité des annonceurs lance 2 visuels par mois et les laisse "
    "tourner jusqu'à épuisement. Conséquence directe : fatigue créative, "
    "CTR qui s'effondre, CPM qui explose.",
    "COÛT MOYEN OBSERVÉ", "x2 CPM en 30 jours sur créa fatiguée",
)
section_solution_page(
    8, TOTAL,
    "ERREUR N°3 · MÉTHODE",
    "Pipeline créatif 2026.",
    "Une machine à créatives produit en continu, teste rapidement, et "
    "scale ce qui marche. La cadence cible : 8 à 12 nouvelles créatives "
    "par semaine pour un compte qui dépense plus de 5K€/mois.",
    [
        {"title": "UGC + statique + motion : 60/25/15",
         "body": "L'UGC reste le format le plus performant en 2026. Mais ne sous-estimez pas le statique — il gagne en CPM rentable."},
        {"title": "Hook test framework",
         "body": "3 hooks différents par concept, 3 secondes max chacun. Vous identifiez le hook gagnant avant de scaler le concept entier."},
        {"title": "Creative refresh tous les 14 jours",
         "body": "Frequency > 3 sur une créa = remplacement. Sinon CPM x1.8 garanti dans les 21 jours qui suivent."},
    ],
)

# 9-10. Erreur 4 — Scaling
section_title_page(
    "4", 9, TOTAL,
    "ERREUR N°4 · SCALING",
    "Scaler trop vite, casser l'algorithme.",
    "Une campagne qui sort un ROAS de 4 sur 200€/jour ne sort pas un "
    "ROAS de 4 sur 2000€/jour. Pourtant le réflexe naturel est de "
    "doubler le budget toutes les 24h dès qu'on voit des résultats. "
    "Conséquence : l'algorithme repart en learning, performance "
    "s'écroule, et on revient au point de départ avec moins de cash.",
    "COÛT MOYEN OBSERVÉ", "-40% de ROAS post-scaling brutal",
)
section_solution_page(
    10, TOTAL,
    "ERREUR N°4 · MÉTHODE",
    "Scaling vertical & horizontal contrôlé.",
    "Le bon scaling Meta respecte deux principes : ne jamais sortir une "
    "campagne du learning, et tester chaque palier avant de passer au "
    "suivant. Vous gardez la performance ET vous montez le volume.",
    [
        {"title": "Vertical : +20% max tous les 3 jours",
         "body": "Au-delà, vous renvoyez la campagne en learning phase et vous perdez 7 à 10 jours de performance."},
        {"title": "Horizontal : duplications avec lifetime budget",
         "body": "Pour franchir un palier de budget, dupliquez l'ad set en lifetime budget. L'algo redémarre frais, sans casser l'original."},
        {"title": "Stop-loss à -50% ROAS sur 7 jours",
         "body": "Si le ROAS tombe sous 50% de votre cible sur 7 jours glissants, on coupe. Pas d'exception, pas de 'on attend une semaine de plus'."},
    ],
)

# 11. Erreur 5 — Analyse
section_title_page(
    "5", 11, TOTAL,
    "ERREUR N°5 · ANALYSE",
    "Aucune analyse post-campagne.",
    "Dépenser 10K€ sur Meta sans débrief structuré, c'est garantir de "
    "refaire les mêmes erreurs au mois suivant. La majorité des "
    "annonceurs regarde le ROAS hebdo, et c'est tout. Aucune lecture "
    "par cohorte, par créative, par audience, par device. Aucune "
    "capitalisation possible.",
    "COÛT MOYEN OBSERVÉ", "ROAS plafonné · pas de progression mois/mois",
)

# 12. Conclusion
page_conclusion(12, TOTAL)

c.save()
print(f"Generated: {OUT}  ({OUT.stat().st_size / 1024:.1f} KB)")
