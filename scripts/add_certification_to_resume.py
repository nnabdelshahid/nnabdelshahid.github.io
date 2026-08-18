from io import BytesIO
import os
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, NameObject, TextStringObject
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(os.environ.get(
    "RESUME_SOURCE",
    ROOT / "resume" / "Nader_Abdelshahid_Resume.pdf",
))
OUTPUT = ROOT / "resume" / "Nader_Abdelshahid_Resume.updated.pdf"
DESTINATION = ROOT / "resume" / "Nader_Abdelshahid_Resume.pdf"

pdfmetrics.registerFont(TTFont(
    "ResumeSans",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
))
pdfmetrics.registerFont(TTFont(
    "ResumeSans-Bold",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
))


def certification_overlay(width: float, height: float):
    packet = BytesIO()
    pdf = canvas.Canvas(packet, pagesize=(width, height))

    left, right = 42, width - 42
    heading_y, rule_y, text_y = 563, 558, 544

    pdf.setFillColor(HexColor("#1F4E79"))
    pdf.setFont("ResumeSans-Bold", 11)
    pdf.drawString(left, heading_y, "CERTIFICATIONS")

    pdf.setStrokeColor(HexColor("#8A8A8A"))
    pdf.setLineWidth(0.45)
    pdf.line(left, rule_y, right, rule_y)

    pdf.setFillColor(HexColor("#111111"))
    pdf.setFont("ResumeSans-Bold", 9.5)
    name = "MongoDB Associate Developer"
    pdf.drawString(left, text_y, name)
    name_width = pdf.stringWidth(name, "ResumeSans-Bold", 9.5)
    pdf.setFont("ResumeSans", 9.5)
    pdf.drawString(left + name_width + 3, text_y, "| MongoDB | Aug 2026")

    pdf.save()
    packet.seek(0)
    return PdfReader(packet).pages[0]


reader = PdfReader(SOURCE)
writer = PdfWriter()

for index, page in enumerate(reader.pages):
    if index == 1:
        page.merge_page(
            certification_overlay(float(page.mediabox.width), float(page.mediabox.height))
        )
    writer.add_page(page)

metadata = dict(reader.metadata or {})
metadata["/Keywords"] = metadata.get("/Keywords", "") + ", MongoDB, Certification"
metadata["/Subject"] = "Software Engineer Resume with MongoDB Associate Developer Certification"
writer.add_metadata({k: str(v) for k, v in metadata.items() if v is not None})

with OUTPUT.open("wb") as stream:
    writer.write(stream)

DESTINATION.unlink(missing_ok=True)
OUTPUT.rename(DESTINATION)
