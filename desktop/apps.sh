#!/usr/bin/env bash

rm -f ./src/style.css

sassc ./src/styles/index.scss ./src/style.css

ags -r 'avalanche.active.setView("apps")' $@
