STDERR.puts "Seeding Sources"

require './db/seeds/professions.rb'

source_statements = EMDROS[:statement_objects].map { |s| {statement_id: s[:object_id_d], source_id: s[:mdf_sources].to_s.strip.to_i}}
source_statements.each do |source_statement|
	source_id = source_statement[:source_id]
	if source_id > 0
		DB[:source_statements].insert(source_statement)
	end
end

seed_professions("source_profession_statements", "mdf_sources")
