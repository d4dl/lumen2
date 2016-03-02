#!/bin/bash
#link this to your web server doc root and run it.
#It checks out the src to the directory you can run it from
# You'll need to use http://localhost/quickmit/setup/account-configuration
#to configure a new school.  The generated snippet will need to be modified.
# to point to localhost.  You'll need to create an html page and paste the
# modified snippet in.
#this hasn't been updated since the move to gitub
cvs -d:ext:jdeford@microcrowd.com:/usr/home/jdeford/cvsroot co -d quickmit Lumen2
mkdir quickmit/clients/installation
chmod 755 -R quickmit
