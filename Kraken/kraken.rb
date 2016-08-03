#!/usr/bin/env ruby

require 'rubygems'
require 'sequel'
require 'json'
require 'pp'

DB = Sequel.connect('sqlite:///tmp/SourceView.sqlite3')

actant_objects = DB['SELECT DISTINCT actant_objects.*, actant_mdf_real_name_set.string_value AS real_name,
	CASE WHEN sourceactant_objects.object_id_d > 0 THEN 1 ELSE 0 END AS is_source,
	CASE WHEN recipientactant_objects.object_id_d > 0 THEN 1 ELSE 0 END AS is_recipient
FROM actant_objects INNER JOIN actant_mdf_real_name_set ON actant_mdf_real_name_set.id_d = actant_objects.mdf_real_name
	LEFT JOIN sourceactant_objects ON actant_objects.mdf_actant_id = sourceactant_objects.mdf_actant_id
	LEFT JOIN recipientactant_objects ON actant_objects.mdf_actant_id = recipientactant_objects.mdf_actant_id']


def value_or_nil(value)
  value.to_s.strip.length > 0 ? value : nil
end


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

File.open("actants.json", "w+") { |f| f.write JSON.pretty_generate(actants) }
