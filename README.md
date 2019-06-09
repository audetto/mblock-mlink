# mblock-mlink
Multiplatform version of mblock-mlink tool

The source code comes from
- http://www.mblock.cc/mblock-software/
- https://dl.makeblock.com/mblock5/linux/mLink-1.2.0-amd64.deb
- https://dl.makeblock.com/mblock5/linux/mLink-1.2.0-1.el7.x86_64.rpm
- https://dl.makeblock.com/mblock5/win32/mLinkSetup.exe

Changes are
- beautify javascript source
- it does not include external modules
- it does not include the node executable
- non platform specific
- can be installed and run as a node application

It is not clear why the Windows and Linux version are slightly different: I don't know which one is more recent, and being node.js apps, they work on both platforms anyway.
