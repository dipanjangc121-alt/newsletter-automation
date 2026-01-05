# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import sys
import subprocess

if len(sys.argv) != 3:
    print("Usage: python html_to_pdf.py <input_html> <output_pdf>")
    sys.exit(1)

input_html = sys.argv[1]
output_pdf = sys.argv[2]

wkhtmltopdf_path = r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"

subprocess.run(
    [wkhtmltopdf_path, input_html, output_pdf],
    check=True
)

print("PDF generated successfully:", output_pdf)

