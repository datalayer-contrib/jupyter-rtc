"""myst-parser package setup."""
from importlib import import_module

from setuptools import find_packages, setup

setup(
    name="jupyter_rtc_docs",
    version='0.0.1',
    description=(
        "JupyterLab RTC"
    ),
    url="https://github.com/jupyterlab/rtc",
    project_urls={"Documentation": "https://jupyterlab-rtc.readthedocs.io"},
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: Implementation :: CPython",
        "Programming Language :: Python :: Implementation :: PyPy",
    ],
    keywords="jupyter,rtc",
    python_requires=">=3.6",
    install_requires=[
    ],
    extras_require={
        "sphinx": [],
        "code_style": [
            "flake8<3.8.0,>=3.7.0", 
            "black", 
            "pre-commit==1.17.0"
        ],
        "testing": [
            "coverage",
            "pytest>=3.6,<4",
            "pytest-cov",
            "pytest-regressions",
            "beautifulsoup4",
        ],
        "rtd": [
            "myst_nb",
            "pyyaml",
            "docutils>=0.15",
            "sphinx",
            "sphinxcontrib-bibtex",
            "sphinxcontrib-mermaid",
            "ipython",
            "sphinx-book-theme",
            "sphinx_tabs"
        ],
    },
    zip_safe=True,
)
