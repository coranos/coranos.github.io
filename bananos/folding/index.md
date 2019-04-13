# Banano Folding Headless Client

## Folding Guide

This walkthrough is based on the guide on the folding at home webpage, modified slightly for banano.

1) First, get a username for you wallet at the banano miner website:

https://bananominer.com/

remember bot the user name and the team id.

2) Second, get a passkey from the folding at home site:

https://apps.foldingathome.org/getpasskey

This increases your score.

3) follow the below guide:

https://foldingathome.org/support/faq/installation-guides/linux/

Which is basically:

      wget https://download.foldingathome.org/releases/public/release/fahclient/debian-stable-64bit/v7.5/fahclient_7.5.1_amd64.deb

      sudo dpkg -i --force-depends fahclient_7.5.1_amd64.deb

enter user name

enter team number

enter passkey

auostart or no

      sudo /etc/init.d/FAHClient help


## common special cases

1) subprocess installed post-installation script returned error exit status 1

https://foldingforum.org/viewtopic.php?p=287334#p287334

    sudo ln -s /usr/lib/python2.7 /usr/lib/python2.6

2) granting remote web access

https://www.iceflatline.com/2017/12/install-and-configure-foldinghome-on-ubuntu-server/

      <allow>192.168.10.100</allow>
      <web-allow>192.168.10.100</web-allow>
