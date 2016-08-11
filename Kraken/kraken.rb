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

require './db/seeds/statements'
require './db/seeds/books'
require './db/seeds/actants'
require './db/seeds/spheres'
require './db/seeds/gender'
require './db/seeds/nature'
require './db/seeds/professions'
require './db/seeds/chronology'
require './db/seeds/roles'
require './db/seeds/actant_number'
