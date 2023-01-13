#!/bin/bash

echo "The files in the directory will moved the other directory"

for file in $(ls x*):
do
  echo "moving"$file
  mv $file ../ibm_entry
  sleep 2
done
