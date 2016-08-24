#!/bin/sh

KEY="0x67d3d67d 0x22798509 0x13e6b1c9 0x34c22397 0x61e1b5b1 0x38c4d1b1 0x25e3f6d9 0x1a2f29d7"
BPTDUMP="/Users/jonathan/Projects/Clients/SourceView/SourceViewLibrary/emdros-3.4.1.pre30/src/bptdump"
SQLITE=$1
BPT=$2

$BPTDUMP --key "$KEY" -d $SQLITE $BPT
