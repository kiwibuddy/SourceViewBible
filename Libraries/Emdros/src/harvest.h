/*
 * harvest.h - functions for harvesting
 *
 * Copyright (C) 2016 SourceView LLC. All rights reserved.
 *
 * Created: 2016/04/01
 * Last update: 2016/04/01
 *
 * Contributors:
 *
 * Ulrik Sandborg-Petersen
 * Jonathan Younger
 *
 */

#ifndef HARVEST_H_
#define HARVEST_H_

#include <map>
#include <string>

#include "emdros.h"

bool getMonadsForBook(EmdrosEnv *pEE, const std::string& book, monad_m& first_monad, monad_m& last_monad);

#endif /* !defined(HARVEST_H_) */

