import re
import os
import codecs
import pathlib
from os import path
from io import open
from setuptools import setup, find_packages
from pkg_resources import parse_requirements


def read_requirements(path):
    with open(path, "r") as f:
        requirements = f.read().splitlines()
        processed_requirements = []

        for req in requirements:
            # For git or other VCS links
            if req.startswith("git+") or "@" in req:
                pkg_name = re.search(r"(#egg=)([\w\-_]+)", req)
                if pkg_name:
                    processed_requirements.append(pkg_name.group(2))
                else:
                    # You may decide to raise an exception here,
                    # if you want to ensure every VCS link has an #egg=<package_name> at the end
                    continue
            else:
                processed_requirements.append(req)
        return processed_requirements


requirements = read_requirements("requirements.txt")
here = path.abspath(path.dirname(__file__))

with open(path.join(here, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

# loading version from setup.py
with codecs.open(
    os.path.join(here, "./__init__.py"), encoding="utf-8"
) as init_file:
    version_match = re.search(
        r"^__version__ = ['\"]([^'\"]*)['\"]", init_file.read(), re.M
    )
    version_string = version_match.group(1)

setup(
    # TODO(developer): Change this value to your module subnet name.
    name="bittensor_subnet_template",
    version=version_string,
    # TODO(developer): Change this value to your module subnet description.
    description="bittensor_subnet_template",
    long_description=long_description,
    long_description_content_type="text/markdown",
    # TODO(developer): Change this url to your module subnet github url.
    url="https://github.com/opentensor/bittensor-subnet-template",
    # TODO(developer): Change this value to your module subnet author name.
    author="bittensor.com",
    packages=find_packages(),
    include_package_data=True,
    # TODO(developer): Change this value to your module subnet author email.
    author_email="",
    license="MIT",
    python_requires=">=3.8",
    install_requires=requirements,
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Build Tools",
        # Pick your license as you wish
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Topic :: Scientific/Engineering",
        "Topic :: Scientific/Engineering :: Mathematics",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Software Development",
        "Topic :: Software Development :: Libraries",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
)
