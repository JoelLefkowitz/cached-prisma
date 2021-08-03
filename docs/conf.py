import re
import sys
import datetime
import pypandoc

sys.path.append("..")

"""
    Sphinx core settings
"""
project = "cached-prisma"
version = "1.0.0"
author = "Joel Lefkowitz"
master_doc = "index"

extensions = [
    "sphinx.ext.autodoc",
    "sphinx_autodoc_annotation",
    "sphinx.ext.napoleon",
    "sphinx.ext.viewcode",
    "sphinxcontrib.apidoc",
]

html_title = "Cached Prisma"
html_favicon = "static/favicon.ico"

html_static_path = ["static"]
html_css_files = ["quickdocs.css"]

html_permalinks = False
html_add_permalinks = None

exclude_patterns = ["_build", "Thumbs.db", ".DS_Store", "venv"]

"""
    Sphinx autodoc settings
    -> Declares apidoc_module_dir if defined
"""
autodoc_typehints = "description"
typehints_fully_qualified = True
autodoc_default_flags = ["members", "undoc-members"]
napoleon_google_docstring = True

"""
    Yummy sphinx theme settings
"""
html_theme = "yummy_sphinx_theme"
html_theme_options = {
    "navbar_icon": "spin fa-book",
    "github_url": "https://github.com/JoelLefkowitz/cached-prisma"
}

"""
    Runtime work
    -> Generates a copyright for this year
    -> Converts the project readme to HTML
"""
copyright = f"{datetime.datetime.now().year} {author}"

with open("../README.md", "r") as stream:
    html_readme = pypandoc.convert(
        stream.read(),
        "html",
        format="md",
        extra_args=["-s", "-fmarkdown-implicit_figures"]
    )
    
    headerless_readme = re.sub("<h1.*>.*?</h1>", "", html_readme, flags=re.DOTALL)

with open("README.html", "w") as stream:
    stream.write(headerless_readme)
