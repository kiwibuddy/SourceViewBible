#!/usr/bin/env ruby

require 'rubygems'
require 'sequel'
require 'json'
require 'pp'

def value_or_nil(value)
  value.to_s.strip.length > 0 ? value : nil
end

EMDROS = Sequel.connect('sqlite://../../SVB2/sphereview.sqlite3')

DB_NAME = '/tmp/SourceView.sqlite3'
File.delete(DB_NAME) rescue nil
DB = Sequel.connect("sqlite://#{DB_NAME}")

Sequel.extension :migration
Sequel::Migrator.run(DB, "db/migrations")

THE_NARRATOR = "The Narrator"
SOURCE_NARRATOR_ID = EMDROS[:source_mdf_source_name_set]["string_value = ?", THE_NARRATOR][:id_d]
EXCLUDE_ACTANTS = [236, 257, 766]; # Word around Hebrews. Need to change these number if we get a new data dump

require './db/seeds/seeds'
