# mblock-mlink
Multiplatform version of mblock-mlink tool

The source code comes from
- http://www.mblock.cc/mblock-software/
- https://dl.makeblock.com/mblock5/linux/mLink-1.2.0-amd64.deb
- https://dl.makeblock.com/mblock5/linux/mLink-1.2.0-1.el7.x86_64.rpm
- https://dl.makeblock.com/mblock5/win32/mLinkSetup.exe
- https://dl.makeblock.com/mblock5/darwin/mLink.pkg

Changes are
- beautify javascript source
- it does not include external modules
- it does not include the node executable
- non platform specific
- can be installed and run as a node application

It is not clear why the Windows/MacOS and Linux versions are slightly different: I don't know which one is more recent, and being node.js apps, they work on all platforms anyway.
The Linux app seems to do a wifi scan as well, a feature not present in the other 2.
