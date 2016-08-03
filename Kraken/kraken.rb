#!/usr/bin/env ruby

require 'rubygems'
require 'sequel'
require 'json'
require 'pp'

DB = Sequel.connect('sqlite:///tmp/SourceView.sqlite3')

def value_or_nil(value)
  value.to_s.strip.length > 0 ? value : nil
end

actant_objects = DB['SELECT DISTINCT actant_objects.*, actant_mdf_real_name_set.string_value AS real_name,
	CASE WHEN sourceactant_objects.object_id_d > 0 THEN 1 ELSE 0 END AS is_source,
	CASE WHEN recipientactant_objects.object_id_d > 0 THEN 1 ELSE 0 END AS is_recipient
FROM actant_objects INNER JOIN actant_mdf_real_name_set ON actant_mdf_real_name_set.id_d = actant_objects.mdf_real_name
	LEFT JOIN sourceactant_objects ON actant_objects.mdf_actant_id = sourceactant_objects.mdf_actant_id
	LEFT JOIN recipientactant_objects ON actant_objects.mdf_actant_id = recipientactant_objects.mdf_actant_id']

actants = actant_objects.all.map do |actant_object|
  name = actant_object[:real_name]
  first_initial = name[0]

  {
    id: actant_object[:mdf_actant_id],
    name: name,
    firstInitial: first_initial,
    natureValues: value_or_nil(actant_object[:mdf_natures]),
    gender: actant_object[:mdf_gender],
    actantNumber: actant_object[:mdf_source_number],
    chronologyValues: value_or_nil(actant_object[:mdf_chronology]),
    professionValues: value_or_nil(actant_object[:mdf_professions]),
    isSource: actant_object[:is_source] == 1,
    isRecipient: actant_object[:is_recipient] == 1,
  }
end

pp actants
File.open("data/actants.json", "w+") { |f| f.write JSON.pretty_generate(actants) }

statements = []
statement_objects = DB['SELECT statement_objects.*, source_objects.mdf_source_occurrence
FROM statement_objects INNER JOIN source_objects ON source_objects.first_monad = statement_objects.first_monad
	AND source_objects.last_monad = statement_objects.last_monad']

statement_objects.each do |statement_object|
	recipient_values = statement_object[:mdf_recipients].split(" ")
	recipient_values.each do |recipient_id|
		id = statements.length + 1
		statements << {
			id: id,
			firstMonad: statement_object[:first_monad],
			lastMonad: statement_object[:last_monad],
			recipientID: recipient_id.to_i,
			sourceID: statement_object[:mdf_sources].to_s.strip.to_i,
      sourceOccurrence: statement_object[:mdf_source_occurrence]
		}
	end
end

pp statements
File.open("data/statements.json", "w+") { |f| f.write JSON.pretty_generate(statements) }
