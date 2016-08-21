#!/usr/bin/env ruby
require 'csv'
require 'json'
require 'pp'

BOOKS = JSON.parse(open("app/books.json").read)

filename = File.expand_path(ARGV[0] || "~/Desktop/SV/Intros/BookIntros.csv")

overviews = {}
rows = CSV.open(filename, headers: true).read
result = rows.collect do |row|
  if book = BOOKS.find{ |b| b["name"].downcase == row["Books"].to_s.downcase}
    overview = overviews[book["id"]] || []
    heading = row["Heading"]
    heading = "How to Read #{book["name"]}" if heading == "How to Read"
    overview << {
      "title" => heading,
      "body" => row["Text"]
    }
    overviews[book["id"]] = overview

  elsif row["Books"]
    STDERR.puts "Missing #{row["Books"]}"
  end
end

books = BOOKS.map{ |b| b.merge({"overview" => overviews[b["id"]]}) }

STDOUT.puts JSON.pretty_generate(books)
