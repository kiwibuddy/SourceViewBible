#!/bin/sh

KEY='0x30a12829 0x0228f527 0x1871813d 0x652567e9 0x5cea28b5 0x3d7d4bc7 0x500fecd1 0x6c93568d'
BPTDUMP="/Users/jonathan/Projects/Clients/SourceView/SourceViewLibrary/emdros-3.4.1.pre30/src/bptdump"
SQLITE=$1
BPT=$2

$BPTDUMP --key "$KEY" -d $SQLITE $BPT
