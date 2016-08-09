STDERR.puts "Seeding Sources"

require './db/seeds/professions.rb'
require './db/seeds/gender.rb'
require './db/seeds/natures.rb'
require './db/seeds/actant_number.rb'
require './db/seeds/chronology.rb'
require './db/seeds/source_types'

source_statements = EMDROS[:statement_objects].map { |s| { id: s[:mdf_sources].to_s.strip.to_i, statement_id: s[:object_id_d]}}
source_statements.each do |source_statement|
	id = source_statement[:id]
	if id > 0
		DB[:source_statements].insert(source_statement)
	end
end

seed_profession_statements("source")
seed_gender_statements("source")
seed_nature_statements("source")
seed_actant_number_statements("source")
seed_chronology_statements("source")
