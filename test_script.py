import sys
from article_script import main

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "test query"
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    category = sys.argv[3] if len(sys.argv) > 3 else "news"
    
    result = main(query, count=count, category=category)
    print(json.dumps(result, indent=2))
