STDERR.puts "Seeding Recipients"

require './db/seeds/professions.rb'
require './db/seeds/gender.rb'
require './db/seeds/natures.rb'
require './db/seeds/actant_number.rb'

recipient_statements = []
EMDROS[:statement_objects].each do |s|
	s[:mdf_recipients].to_s.strip.split(" ").map{|r| r.to_i}.each do |recipient_id|
		DB[:recipient_statements].insert({statement_id: s[:object_id_d], recipient_id: recipient_id}) if recipient_id > 0
	end
end

seed_profession_statements("recipient")
seed_gender_statements("recipient")
seed_nature_statements("recipient")
seed_actant_number_statements("recipient")
