STDERR.puts "Seeding Sphere Statements"

statement_word_counts = JSON.parse(open('./db/seeds/statement-word-counts.json').read)

sphere_statements = JSON.parse(open('./db/seeds/sphere-statements.json').read)
sphere_statements.each do |sphere_statement|
  sphere_id = sphere_statement["id"]
  statement_word_count = statement_word_counts.find { |word_count| word_count["id"] == sphere_statement["statement_id"]}
  sphere_word_count = statement_word_count["sphereCounts"][sphere_id - 1]

  DB[:sphere_statements].insert(sphere_statement.merge({word_count: sphere_word_count["count"]}))
end
