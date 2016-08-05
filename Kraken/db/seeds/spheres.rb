STDERR.puts "Seeding Sphere Statements"

sphere_statements = JSON.parse(open('./db/seeds/sphere-statements.json').read)
sphere_statements.each do |sphere_statement|
  DB[:sphere_statements].insert(sphere_statement)
end
