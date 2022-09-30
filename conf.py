# Configuration file for the Sphinx documentation builder.
# http://www.sphinx-doc.org/en/master/config

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import os
import sys
import time
sys.path.insert(0, os.path.abspath('.'))

# -- Project information -----------------------------------------------------

project = 'CATO'
copyright = time.strftime("%B %d, %Y") + ', Dutch Connectome Lab'
author = 'Dutch Connectome Lab'

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = ['sphinx.ext.autodoc', 'sphinx.ext.autosectionlabel', 'sphinxcontrib.bibtex', 'sphinxcontrib.contentui']
bibtex_bibfiles = ['docs/references.bib']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
html_sidebars = {'**' : ['globaltoc.html']}

html_theme = 'sphinxbootstrap4theme'
html_theme_path = ['_theme']

# Html logo in navbar.
# Fit in the navbar at the height of image is 37 px.
html_logo = 'images/CATO_logo.svg'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static', '_static/css'] # Add all folders such that css is updated

html_theme_options = {
    'navbar_links' : [
        ("GitHub", "https://github.com/dutchconnectomelab/CATO", True),
        ("Dutch Connectome Lab", "http://www.dutchconnectomelab.nl", True)
    ],
    'sidebar_right': False,
    'sidebar_fixed': True,
    'navbar_style': 'fixed-top',
    'navbar_show_pages': False,
    'navbar_color_class': 'light',
    'navbar_bg_class': 'light',
    'main_width':100,
}

html_favicon = 'images/CATO_32px.png'

html_css_files = [
	'css/custom.css']

html_js_files = [
    'js/cloudflare.js'
    ]

rst_prolog= u"""
    .. |project| replace:: sphinxbootstrap4
"""
