STDERR.puts "Seeding Recipients"

require './db/seeds/professions.rb'
require './db/seeds/gender.rb'
require './db/seeds/natures.rb'
require './db/seeds/actant_number.rb'
require './db/seeds/chronology.rb'
require './db/seeds/recipient_types'

recipient_statements = []
EMDROS[:statement_objects].each do |s|
	s[:mdf_recipients].to_s.strip.split(" ").map{|r| r.to_i}.each do |id|
		DB[:recipient_statements].insert({id: id, statement_id: s[:object_id_d]}) if id > 0
	end
end

seed_profession_statements("recipient")
seed_gender_statements("recipient")
seed_nature_statements("recipient")
seed_actant_number_statements("recipient")
seed_chronology_statements("recipient")
