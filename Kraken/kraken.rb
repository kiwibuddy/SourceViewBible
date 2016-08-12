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

require './db/seeds/actants'
require './db/seeds/sources'
require './db/seeds/sources_actants'
