STDERR.puts "Seeding Book Statements"

books = JSON.parse(open('./db/seeds/book-monads.json').read)

EMDROS[:statement_objects].each do |statement_object|
  if book = books.find { |book| statement_object[:first_monad] >= book["firstMonad"] && statement_object[:last_monad] <= book["lastMonad"] }
    book_statement = {id: book["id"], statement_id: statement_object[:object_id_d]}
    DB["book_statements".to_sym].insert(book_statement) rescue nil
  end
end
