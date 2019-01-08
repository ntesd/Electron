StreamDesk
==========
StreamDesk is a open source desktop client for viewing many of the common video streaming sites.

Features
--------
* Community built stream list
* Simple stream list with single level category sorting
* Database update
* Simple database editor
* Full updater with downloader
* Easy to use favorites
* Keyword search

After Checkout
==============
Once the source is checked out or downloaded, you need to generate release info. To do this run
the following command

    npm run generate-release-info -- -d -t Debug

This will create the release-generated.js file used for the release.js module for Version Information

If you want to build a release build just run

    npm run generate-release-info

Create Package
==============
To get the final product to package in the platform's final format (DMG, RPM, etc.) run the following
commands:

* Windows: npm run package-win
* Linux: npm run package-linux
* Mac: npm run package-mac
