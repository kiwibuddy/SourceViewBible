#!/usr/bin/env ruby
require 'csv'
require 'json'
require 'pp'

BOOKS = JSON.parse(open("app/books.json").read)

filename = File.expand_path(ARGV[0] || "~/Desktop/SV/Intros/SphereIntros.csv")

spheres = {}
rows = CSV.open(filename, headers: true).read
result = rows.collect do |row|
  spheres[row["SPHERE"].downcase] = {
    "id" => row["SPHERE"].downcase,
    "description" => row["INTRO"]
  } if row["SPHERE"]
end


STDOUT.puts JSON.pretty_generate(spheres)
