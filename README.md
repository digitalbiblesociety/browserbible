# Browser Bible 

A browser based Bible Study Application built with the holy trinity of HTML, CSS, and JavaScript.

* Created by: [http://www.dbsbible.org](Digital Bible Society)
* Project Leader: John Dyer [http://j.hn/](http://j.hn/)
* Code License: GPLv2/MIT
* Content License: See each content folder for a license

## Goals

HTML and JavaScript based Bible software that can run

* on any browser
* on any device
* in any nation

The application has full search and highlighting features but requires

* no install
* no server
* no trace

To make this happen, there are two ways to view the same biblical content

* *Mobile Version* - The mobile version uses [http://www.jquerymobile.com/](jQuery Mobile) to navigate through the Bible chapter by chapter
* *Desktop Version* - The desktop version is a multipane application based off ideas at [http://biblewebapp.com/](http://biblewebapp.com/)

## Credits

### Original Language Data

Many of the texts are the product of the hard work of many individuals dedicated to open
source work including [http://openscriptures.org](Open Scriptures) and [http://www.crosswire.org/](CrossWire). Thanks for the great work!

* *KJV text* - [http://www.crosswire.org/~dmsmith/kjv2006/index.html](KJV2006 project) from Crosswire
* *Tischendorf* - [https://github.com/morphgnt/tischendorf-data](MorphNT) from Ulrik Sandborg-Petersen 
* *WLC* - [https://github.com/openscriptures/morphhb](MorphHB) project from Open Scriptures and David Troidl
* *Strongs* - [https://github.com/openscriptures/strongs](strong database) in JSON format

### English Versions

* [http://openenglishbible.org/](Open English Version)
* [http://ebible.org](World English Bible)

### Non-English Verions

* The remaining versions in this repository were downloaded from [http://www.unboundbible.org](Unbound Bible)

## Road Map

### 0.2 Todo List

* ~~Put version info into version.json within folder, then load dynamically~~
* ~~Store current state / preferences~~
* ~~Add/delete columns~~
* Chapter/verse Navigation Dropdown
* handle missing books (e.g. Psalms and NT)
* handle apocrypha
* Allow version to switch if a book is missing (WLC -> tisch is hardcoded)
* Build NASB importer

### 0.3 Todo List

* Add Audio player
* Add video launcher
* Add maps/images links
* Add original language tools (highlighting tense/voice/freq)
* Change theme colors
* Change font size within the reader

### Done

* Basis strongs numbers and greek parsing
* Footnotes now display in the footer
* about.html page for each version (loads with 'i' button)
* Switched from `v001001001` to OSIS style `Gen.1.1`
* Rebuilt exporters for OSIS/XML, USMF, Unbound.
* Build search into application
* Build WLC, Tischendorf importers
* index.html, about.html for all languages/versions

### Known Issues

* Notes and CF needs work
* OSIS quotes span over verses
* USMF doesn't handle quote lines (OEB, WEB)