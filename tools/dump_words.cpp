/*
 * dump_words.cpp - proof-of-recovery harness.
 *
 * Opens the encrypted Emdros corpus (SourceView.bpt) with the key committed in
 * this repo and prints "<monad>\t<surface>\t<Family..Celebration flags>" for a
 * range of word tokens. This demonstrates that the word-level data is fully
 * recoverable from files already in the repository.
 *
 * Build: see tools/build_dump_words.sh
 * Usage: dump_words <path-to-SourceView.bpt> [firstMonad] [lastMonad]
 */

#include <emdros.h>

#include <cstdlib>
#include <iostream>
#include <sstream>
#include <string>

// The Emdros BPT "scheduled key" for SourceView.bpt.
// Source: Libraries/Emdros/ios/RCTEmdros/RCTEmdros/RCTEmdrosEnv.mm (line 15),
// identical to the key in Kraken/sqlite-to-bpt.sh.
static const char *CORPUS_KEY =
    "0x67d3d67d 0x22798509 0x13e6b1c9 0x34c22397 "
    "0x61e1b5b1 0x38c4d1b1 0x25e3f6d9 0x1a2f29d7";

int main(int argc, char **argv) {
    if (argc < 2) {
        std::cerr << "usage: dump_words <SourceView.bpt> [firstMonad] [lastMonad]\n";
        return 1;
    }
    std::string db = argv[1];
    long firstM = (argc > 2) ? std::atol(argv[2]) : 1;
    long lastM = (argc > 3) ? std::atol(argv[3]) : 120;

    std::string hostname("localhost"), user("emdf"), key(CORPUS_KEY);
    EmdrosEnv *pEE =
        new EmdrosEnv(kOKConsole, kCSUTF8, hostname, user, key, db, kBPT);

    if (!pEE->connectionOk()) {
        std::cerr << "CONNECTION FAILED (wrong key or unreadable BPT)\n";
        return 2;
    }
    std::cerr << "Connected OK to encrypted BPT: " << db << "\n";

    std::ostringstream q;
    q << "SELECT ALL OBJECTS IN {" << firstM << "-" << lastM << "} "
      << "WHERE [Token GET surface, Family, Economics, Government, Religion, "
         "Education, MediaCom, Celebration]";

    bool bCompile = false;
    bool bDB = pEE->executeString(q.str(), bCompile, false, false, 0);
    if (!(bDB && bCompile)) {
        std::cerr << "QUERY FAILED\n  DB: " << pEE->getDBError()
                  << "\n  Compiler: " << pEE->getCompilerError() << "\n";
        return 3;
    }
    if (!pEE->isSheaf()) {
        std::cerr << "Result was not a sheaf.\n";
        return 4;
    }

    Sheaf *pSheaf = pEE->takeOverSheaf();
    SheafConstIterator sci = pSheaf->const_iterator();
    while (sci.hasNext()) {
        const Straw *pStraw = sci.next();
        StrawConstIterator sti = pStraw->const_iterator();
        while (sti.hasNext()) {
            const MatchedObject *mo = sti.next();
            long m = (long)mo->getMonads().first();
            std::string surface = mo->getFeatureAsString(0);
            std::string spheres;
            const char *names[7] = {"family",    "economics", "government",
                                    "religion",  "education",  "communication",
                                    "celebration"};
            for (int i = 0; i < 7; ++i) {
                if (mo->getFeatureAsString(i + 1) != "false") {
                    if (!spheres.empty()) spheres += ",";
                    spheres += names[i];
                }
            }
            std::cout << m << "\t" << surface << "\t" << spheres << "\n";
        }
    }
    delete pSheaf;
    delete pEE;
    return 0;
}
