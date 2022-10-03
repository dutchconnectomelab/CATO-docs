<a href="http://www.dutchconnectomelab.nl/CATO"><img src="http://www.dutchconnectomelab.nl/CATO/assets/img/CATO_logo.svg" alt="Logo CATO" width="200"/></a>

# CATO documentation
This repository contains the source-code of the CATO documentation website [http://www.dutchconnectomelab.nl/CATO](http://www.dutchconnectomelab.nl/CATO).

The documentation is in [reStructuredText](https://en.wikipedia.org/wiki/ReStructuredText) format and uses [Sphinx](https://www.sphinx-doc.org/en/master/) to convert the documentation to an HTML website. Plugins used for the conversion are listed in the [requirements](requirements.txt) file.

## Documentation overview
|Folder|Description|
|-------|-------------|
|_index|Files for the customized index page that is used instead of the index page generated by Sphinx.|
|_static|Custom static files such as style sheets, JavaScript files and files for the Configuration Assistant.|
|_theme|Files for theme used (an adaption of the sphinxbootstrap4theme).|
|docs|Documentation files and bibliography.|
|images|Images used in the documentation files.|

## Generate documentation (in HTML format)
HTML formatted documentation (as presented on the website) can be generated locally or using GitHub Actions.

**Local build:** After installing Sphinx and the requirements, HTML documentation can be generated by executing in the CATO-docs directory:

```
sphinx-build -b html . _build/html
```  
  
and to replace the index page with the customized index page:

```
cp ./_index/index.html ./_build/html
cp -r ./_index/assets ./_build/html
```

**GitHub Actions:** HTML documentation can also be generated using the workflow ["Check and build HTML docs"](https://github.com/dutchconnectomelab/CATO-docs/actions/workflows/main.yml). This workflow is automatically triggered when a pull request is made. This workflow can also be triggered manually using the `Run workflow` button on the workflow page.

## Citation
> [Structural and functional connectivity reconstruction with CATO - A Connectivity Analysis TOolbox](https://www.biorxiv.org/content/10.1101/2021.05.31.446012v1)
>
> de Lange SC, van den Heuvel MP, bioRxiv, 2021
