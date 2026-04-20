from pdfminer.high_level import extract_text as pdf_extract_text
from docx import Document
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    return pdf_extract_text(io.BytesIO(file_bytes))


def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join(paragraph.text for paragraph in doc.paragraphs if paragraph.text.strip())


def extract_resume_text(file_bytes: bytes, filename: str) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    if lower.endswith(".docx") or lower.endswith(".doc"):
        return extract_text_from_docx(file_bytes)
    raise ValueError(f"Unsupported file type: {filename}")
