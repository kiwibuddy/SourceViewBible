#!/usr/bin/env ruby

require 'json'
require 'csv'
require 'pp'
require 'pericope'

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

    s
  end
end

filename = File.expand_path("~/Desktop/SV/Spheres/EconomicsPassages.csv")
json = {}

rows = CSV.open(filename, headers: true).read

sectionKey = nil
section = nil
rows.each do |row|
  next if row["index"].nil? 
  if row["index"].to_i == 0
    sectionKey = row["index"]
    section = []
    json[sectionKey] = section
  else
    if pericope = Pericope.parse_one(row["reference"])
      references = references_from_pericope(pericope).map do |reference|
        {
          "firstMonad" => 0,
          "lastMonad" => 0,
          "reference" => "#{pericope.book_name} #{reference}",
          "text" => ""
        }
      end

      section << {
        "number" => row["index"].to_i,
        "title" => row["title"],
        "subtitle" => pericope.to_s,
        "references" => references
      }
    else
      STDERR.puts "Could not parse reference #{row["reference"]}"
    end
  end
end

pp json
