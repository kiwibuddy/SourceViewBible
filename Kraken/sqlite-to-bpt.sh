#!/bin/sh

KEY="0xd1972d97 0xacdc53c8"
BPTDUMP="/Users/jonathan/Projects/Clients/SourceView/SourceViewLibrary/emdros-3.4.1.pre30/src/bptdump"
SQLITE=$1
BPT=$2

$BPTDUMP --key "$KEY" -d $SQLITE $BPT
