# Codex Mysterium

This just-for-fun project is a ReactJS implementation of [Liza Daly's *Seraphs*](https://github.com/lizadaly/nanogenmo2014/).

## Usage

* Install [nodejs](https://nodejs.org/en/) if you don't have it
* Download this project somewhere
* Open a console window, navigate to where you've downloaded the project
* Type `npm install`
* When the installation is done, type `npm run start`

This will open a new browser window. Here, you can make the following changes to your codex:

* Script: Voynich-like or runes
* Force greyscale: If you want a black-and-white document rather than a color one
* Title page: Self-evident
* Table of contents: Listing the chapter names, along with the pages. Illegible as such
* Randomize chapters: Randomly rearrange the chapters of your book (The labels for image selection will randomly not update under FireFox. No idea why, won't bother to fix)
* Chapter count: How many chapters will your codex have?
* Chapter subject: Which image set will be loaded for said chapter
* Pictures for the individual pages
* The option to load a new image set for this chapter (will also randomly reassign images)

The document will probably look wonky in your browser; this is fine, as it's made to look good *on paper*. The print format is A4-sized and landscape-oriented.

When printing, please make sure to have background graphics **enabled** (for the page background colors and images) and print headers **disabled** (page numbers, source URL and so forth).

## Sample results

* [Color version, Voynich-like script](/public/codex-mysterium-color-voynich.pdf) (PDF, 23.6 MB)
* [Black-andWhite version, Runic script](/public/codex-mysterium-bw-runes.pdf) (PDF, 3.6MB)

* * *

This project has been tested in [Chrome 66](https://www.google.com/chrome/) and [FireFox 60](https://www.mozilla.org/en-US/firefox/) under Windows 10. It should work in any modern browser.
