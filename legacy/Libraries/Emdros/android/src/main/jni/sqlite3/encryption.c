/*
** Key an encrypted SQLite database.  This does nothing.
**
** The code here is implemented by Ulrik Petersen.  Another version
** is available from D. Richard Hipp, the author of SQLite, which
** actually does enable encryption.
*/
#include "sqlite3.h"

int sqlite3_key(sqlite3 *pDB,      /** DB to alter. */
               const void* pKey,  /** The key. */
               int nKey)          /** Key's length. */
{
       return SQLITE_OK;
}


/*
 * This code is by Ulrik Sandborg-Petersen.
 * Dr. Hipp, the creator of SQLite, has real encryption.
 */
int sqlite3_open_encrypted(
  const char *zFilename,   /* Name of the encrypted database */
  const void *pKey,        /* Pointer to the key */
  int nKey,                /* Number of bytes in the key */
  sqlite3 **ppDB
)
{
        return sqlite3_open(zFilename, ppDB);
}
