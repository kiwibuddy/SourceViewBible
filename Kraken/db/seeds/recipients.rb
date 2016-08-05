STDERR.puts "Seeding Recipients"

require './db/seeds/professions.rb'

recipient_statements = []
EMDROS[:statement_objects].each do |s|
	s[:mdf_recipients].to_s.strip.split(" ").map{|r| r.to_i}.each do |recipient_id|
		recipient_statements << {statement_id: s[:object_id_d], recipient_id: recipient_id} if recipient_id > 0
	end
end

seed_professions("recipient_profession_statements", "mdf_recipients")
