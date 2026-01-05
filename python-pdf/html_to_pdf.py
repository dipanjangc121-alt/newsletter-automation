# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import subprocess
import sys

html_file = sys.argv[1]
pdf_file = sys.argv[2]

subprocess.run(
    ["wkhtmltopdf", html_file, pdf_file],
    check=True
)
