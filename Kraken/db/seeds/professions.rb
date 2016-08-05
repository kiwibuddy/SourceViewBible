
def seed_professions(table, column)
  STDERR.puts "Seeding #{table}"

  EMDROS[:statement_objects].each do |statement_object|
    statement_object[column.to_sym].to_s.strip.split(' ').map{|a| a.to_i}.each do |actant_id|
      if actant = EMDROS[:actant_objects].where(mdf_actant_id: actant_id).first
        actant[:mdf_professions].to_s.strip.split(" ").map{|p| p.to_i}.each do |profession_id|
          if profession_id > 0
            profession_statement = {profession_id: profession_id, statement_id: statement_object[:object_id_d]}
            DB[table.to_sym].insert(profession_statement) rescue nil
          end
        end
      end
    end
  end
end
