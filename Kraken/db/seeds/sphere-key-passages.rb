#!/usr/bin/env ruby

require 'json'
require 'csv'
require 'pp'
require 'pericope'

BOOK_TO_DJHREF = {
  "Genesis" => "Gen",
  "Gen" => "Gen",
  "Exodus" => "Exo",
  "Exo" => "Exo",
  "Leviticus" => "Lev",
  "Lev" => "Lev",
  "Numbers" => "Num",
  "Num" => "Num",
  "Deuteronomy" => "Deu",
  "De" => "De",
  "Joshua" => "Jos",
  "Jos" => "Jos",
  "Judges" => "Jdg",
  "Jdg" => "Jdg",
  "Ruth" => "Rut",
  "Rut" => "Rut",
  "1 Samuel" => "1Sa",
  "1Sa" => "1Sa",
  "2 Samuel" => "2Sa",
  "2Sa" => "2Sa",
  "1 Kings" => "1Ki",
  "1Ki" => "1Ki",
  "2 Kings" => "2Ki",
  "2Ki" => "2Ki",
  "1 Chronicles" => "1Ch",
  "1Ch" => "1Ch",
  "2 Chronicles" => "2Ch",
  "2Ch" => "2Ch",
  "Ezra" => "Ezr",
  "Ezr" => "Ezr",
  "Nehemiah" => "Neh",
  "Neh" => "Neh",
  "Esther" => "Est",
  "Est" => "Est",
  "Job" => "Job",
  "Psalm" => "Psa",
  "Psa" => "Psa",
  "Psalms" => "Psa",
  "Proverbs" => "Pro",
  "Pro" => "Pro",
  "Ecclesiastes" => "Ecc",
  "Ecclesiasties" => "Ecc",
  "Ecc" => "Ecc",
  "Song of Songs" => "SoS",
  "Song of Solomon" => "SoS",
  "SoS" => "SoS",
  "Isaiah" => "Isa",
  "Isa" => "Isa",
  "Jeremiah" => "Jer",
  "Jer" => "Jer",
  "Lamentations" => "Lam",
  "Lam" => "Lam",
  "Ezekiel" => "Eze",
  "Eze" => "Eze",
  "Daniel" => "Dan",
  "Dan" => "Dan",
  "Hosea" => "Hos",
  "Hos" => "Hos",
  "Joel" => "Joe",
  "Joe" => "Joe",
  "Amos" => "Amo",
  "Amo" => "Amo",
  "Obadiah" => "Oba",
  "Oba" => "Oba",
  "Jonah" => "Jon",
  "Jon" => "Jon",
  "Micah" => "Mic",
  "Mic" => "Mic",
  "Nahum" => "Nah",
  "Nah" => "Nah",
  "Habakkuk" => "Hab",
  "Hab" => "Hab",
  "Zephaniah" => "Zep",
  "Zep" => "Zep",
  "Haggai" => "Hag",
  "Hag" => "Hag",
  "Zechariah" => "Zec",
  "Zec" => "Zec",
  "Malachi" => "Mal",
  "Mal" => "Mal",
  "Matthew" => "Mat",
  "Mat" => "Mat",
  "Mark" => "Mar",
  "Mar" => "Mar",
  "Luke" => "Luk",
  "Luk" => "Luk",
  "John" => "Joh",
  "Joh" => "Joh",
  "Acts" => "Act",
  "Act" => "Act",
  "Romans" => "Rom",
  "Rom" => "Rom",
  "1 Corinthians" => "1Co",
  "1Co" => "1Co",
  "2 Corinthians" => "2Co",
  "2Co" => "2Co",
  "Galatians" => "Gal",
  "Gal" => "Gal",
  "Ephesians" => "Eph",
  "Eph" => "Eph",
  "Philippians" => "Php",
  "Php" => "Php",
  "Colossians" => "Col",
  "Col" => "Col",
  "1 Timothy" => "1Ti",
  "1Ti" => "1Ti",
  "2 Timothy" => "2Ti",
  "2Ti" => "2Ti",
  "Titus" => "Tit",
  "Tit" => "Tit",
  "Philemon" => "Phm",
  "Phm" => "Phm",
  "Hebrews" => "Heb",
  "Heb" => "Heb",
  "James" => "Jam",
  "Jam" => "Jam",
  "1 Peter" => "1Pe",
  "1Pe" => "1Pe",
  "2 Peter" => "2Pe",
  "2Pe" => "2Pe",
  "1 John" => "1Jn",
  "1Jn" => "1Jn",
  "2 John" => "2Jn",
  "2Jn" => "2Jn",
  "3 John" => "3Jn",
  "3Jn" => "3Jn",
  "Jude" => "Jud",
  "Jud" => "Jud",
  "Revelation" => "Rev",
  "Rev" => "Rev",
  "Revleation" => "Rev",
  "1 Thessalonians" => "1Th",
  "2 Thessalonians" => "2Th",
}

BOOK_NAME_MAP = {
  "Psalm" => "Psalms",
  "Song of Solomon" => "Song of Songs"
};

def references_from_pericope(pericope)
  recent_chapter = nil # e.g. in 12:1-8, remember that 12 is the chapter when we parse the 8
  recent_chapter = 1 unless pericope.book_has_chapters?
  pericope.ranges.map do |range|
    min_chapter = Pericope.get_chapter(range.begin)
    min_verse = Pericope.get_verse(range.begin)
    max_chapter = Pericope.get_chapter(range.end)
    max_verse = Pericope.get_verse(range.end)
    s = ""

    if min_verse == 1 and max_verse >= Pericope.get_max_verse(pericope.book, max_chapter)
      s << min_chapter.to_s
      s << "-#{max_chapter}" if max_chapter > min_chapter
    else
      if false && recent_chapter == min_chapter
        s << min_verse.to_s
      else
        recent_chapter = min_chapter
        s << "#{min_chapter}:#{min_verse}"
      end

      if range.count > 1

        s << "-"
        if min_chapter == max_chapter
          s << max_verse.to_s
        else
          recent_chapter = max_chapter
          s << "#{max_chapter}:#{max_verse}"
        end
      end
    end

    {
      "book" => pericope.book_name,
      # "reference" => s,
      "minChapter" => min_chapter,
      "minVerse" => min_verse,
      "maxChapter" => max_chapter,
      "maxVerse" => max_verse
    }
  end
end

json = {}

["Foundational", "Family", "Economics", "Religion", "Government", "Education", "Communication", "Celebration"].each do |sphere_name|
  sphere = []
  filename = File.expand_path("../../SVB2/Spheres/KeyPassages/#{sphere_name}-Table 1.csv")
  rows = CSV.open(filename, headers: true).read
  sectionKey = nil
  rows.each do |row|
    next if row["index"].nil?
    if row["index"].to_i == 0
      sectionKey = row["index"]
    else
      if pericope = Pericope.parse_one(row["reference"])
        monads = references_from_pericope(pericope).map do |reference|
          monads = {}
          if djhref = BOOK_TO_DJHREF[pericope.book_name]
            sql = if reference["minChapter"] == reference["maxChapter"]
              "SELECT * FROM verse_objects WHERE (mdf_djhbook = '#{djhref}' AND mdf_chapter = #{reference["minChapter"]} AND mdf_verse_start >= #{reference["minVerse"]} AND mdf_verse_end <= #{reference["maxVerse"]})"
            else
              "SELECT * FROM verse_objects WHERE (mdf_djhbook = '#{djhref}' AND mdf_chapter = #{reference["minChapter"]} AND mdf_verse_start >= #{reference["minVerse"]}) OR (mdf_djhbook = '#{djhref}' AND mdf_chapter = #{reference["maxChapter"]} AND mdf_verse_end <= #{reference["maxVerse"]})"
            end
            verse_objects = EMDROS[sql].to_a
            if verse_objects.length > 0
              first_verse_object = verse_objects.first
              last_verse_object = verse_objects.last
              monads = {
                "bookName": BOOK_NAME_MAP[pericope.book_name] || pericope.book_name,
                "firstMonad": first_verse_object[:first_monad],
                "lastMonad": last_verse_object[:last_monad],
                "chapter": first_verse_object[:mdf_chapter],
                "verse": first_verse_object[:mdf_verse_start]
              }
            else
              STDERR.puts "No result for #{sql}"
            end
          else
            STDERR.puts "Could not find reference for #{pericope.book_name}"
          end
          monads
        end

        sphere << {
          "section" => sectionKey,
          "number" => row["index"].to_i,
          "title" => row["title"],
          "reference" => pericope.to_s,
          "monads" => monads
        }
      else
        STDERR.puts "Could not parse reference #{row["reference"]}"
      end
    end
  end
  json[sphere_name] = sphere
end

File.open("db/seeds/sphere-key-passages.json", "w+") {|f| f.write JSON.pretty_generate(json)}
