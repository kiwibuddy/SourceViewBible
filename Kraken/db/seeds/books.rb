STDERR.puts "Seeding Books"

book_words = {}
EMDROS[:book_objects].each do |book_object|
  djhref = book_object[:mdf_djhref]
  book_words[djhref] = {}

  word_query = "SELECT token_objects.mdf_surface_fts, COUNT(token_objects.mdf_surface_fts) AS count
                FROM book_objects INNER JOIN token_objects ON (token_objects.first_monad >= book_objects.first_monad AND token_objects.first_monad <= book_objects.last_monad)
                WHERE book_objects.mdf_djhref = '#{djhref}' AND mdf_surface_fts NOT IN ('the','and','of','to','you','will','in','I','a','he','for','they','your','is','with','his','from','that','be','all','them','as','who','it','was','but','my','have','s','this','their','are','me','on','him','people','then','so','not','when','were','had','king','what','by','we','at','said','one','has','t','do','son','out','if','there','no','or','land','like','us','must','these','up','those','her','day','our','now','man','into','am','can','come','let','because','go','about','against','give','down','even','don','an','over','other','she','before','made','been','men','its') AND LENGTH(token_objects.mdf_surface_fts) > 2
                GROUP BY token_objects.mdf_surface_fts
                ORDER BY count DESC, token_objects.mdf_surface_fts
                LIMIT 20"
  words = EMDROS[word_query].collect {|row| row[:mdf_surface_fts] }

  words.each do |word|
    token_query = "SELECT token_objects.first_monad
                   FROM book_objects INNER JOIN token_objects ON (token_objects.first_monad >= book_objects.first_monad AND token_objects.first_monad <= book_objects.last_monad)
                   WHERE book_objects.mdf_djhref = '#{djhref}' AND token_objects.mdf_surface_fts = '#{word}'"
    book_words[djhref][word] = EMDROS[token_query].map do |row|
      first_monad = row[:first_monad]

      verse_object = EMDROS[:verse_objects]["first_monad <= ? AND last_monad >= ?", first_monad, first_monad]

      {
        first_monad: first_monad,
        last_monad: first_monad,
        djhref: djhref,
        chapter: verse_object[:mdf_chapter],
        verse: verse_object[:mdf_verse_start]
      }
    end
  end
end


File.open("db/seeds/book_words.json", "w+") { |f| f.write JSON.pretty_generate(book_words) }
