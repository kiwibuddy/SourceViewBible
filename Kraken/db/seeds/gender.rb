
['source', 'recipient'].each do |type|
  STDERR.puts "Seeding #{type} gender statements"

  EMDROS[:statement_objects].each do |statement_object|
    statement_object["mdf_#{type}s".to_sym].to_s.strip.split(' ').map{|a| a.to_i}.each do |actant_id|
      if actant = EMDROS[:actant_objects].where(mdf_actant_id: actant_id).first
        id = actant[:mdf_gender].to_s.to_i
        if id == 1 || id == 2
          gender_statement = {id: id, statement_id: statement_object[:object_id_d]}
          DB["#{type}_gender_statements".to_sym].insert(gender_statement) rescue nil
        end
      end
    end
  end
end

insert_sql = "INSERT INTO gender_statements
SELECT id, statement_id FROM (
SELECT id, statement_id FROM source_gender_statements
UNION
SELECT id, statement_id FROM recipient_gender_statements
)
"
DB.run insert_sql
