
['source', 'recipient'].each do |type|
  STDERR.puts "Seeding #{type} profession statements"

  EMDROS[:statement_objects].each do |statement_object|
    statement_object["mdf_#{type}s".to_sym].to_s.strip.split(' ').map{|a| a.to_i}.each do |actant_id|
      if actant = EMDROS[:actant_objects].where(mdf_actant_id: actant_id).first
        actant[:mdf_professions].to_s.strip.split(" ").map{|p| p.to_i}.each do |id|
          if id > 0
            profession_statement = {id: id, statement_id: statement_object[:object_id_d]}
            DB["#{type}_profession_statements".to_sym].insert(profession_statement) rescue nil
          end
        end
      end
    end
  end
end

insert_sql = "INSERT INTO profession_statements
SELECT id, statement_id FROM (
SELECT id, statement_id FROM source_profession_statements
UNION
SELECT id, statement_id FROM recipient_profession_statements
)
"
DB.run insert_sql
