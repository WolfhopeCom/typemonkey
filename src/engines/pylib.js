/* TypeMonkey's small Python standard library for the in-browser Python (Brython).
   Brython's full stdlib is several megabytes, so these are compact in-house versions of the modules
   beginners reach for first. They follow CPython's behavior for normal use; random numbers come from
   TypeMonkey's own generator, so seeded sequences differ from CPython's. */
const PYLIB={
math:`import javascript as _js
pi = 3.141592653589793
e = 2.718281828459045
tau = 6.283185307179586
inf = float("inf")
nan = float("nan")
def _num(x):
    if not isinstance(x, (int, float)):
        raise TypeError("must be real number, not " + type(x).__name__)
    return x
def floor(x):
    _num(x)
    return int(x // 1)
def ceil(x):
    _num(x)
    return -int((-x) // 1)
def trunc(x):
    return int(x)
def sqrt(x):
    _num(x)
    if x < 0:
        raise ValueError("math domain error")
    return float(x) ** 0.5
def isqrt(n):
    if n < 0:
        raise ValueError("isqrt() argument must be nonnegative")
    r = int(n ** 0.5)
    while r * r > n:
        r -= 1
    while (r + 1) * (r + 1) <= n:
        r += 1
    return r
def pow(x, y):
    return float(x) ** y
def fabs(x):
    return float(abs(x))
def exp(x):
    return float(_js.Math.exp(x))
def log(x, base=None):
    _num(x)
    if x <= 0:
        raise ValueError("math domain error")
    r = float(_js.Math.log(x))
    if base is not None:
        r = r / float(_js.Math.log(base))
    return r
def log2(x):
    return log(x, 2)
def log10(x):
    if x <= 0:
        raise ValueError("math domain error")
    return float(_js.Math.log10(x))
def sin(x): return float(_js.Math.sin(x))
def cos(x): return float(_js.Math.cos(x))
def tan(x): return float(_js.Math.tan(x))
def asin(x): return float(_js.Math.asin(x))
def acos(x): return float(_js.Math.acos(x))
def atan(x): return float(_js.Math.atan(x))
def atan2(y, x): return float(_js.Math.atan2(y, x))
def hypot(*xs): return sqrt(sum(v * v for v in xs))
def degrees(x): return x * 180.0 / pi
def radians(x): return x * pi / 180.0
def factorial(n):
    if not isinstance(n, int) or n < 0:
        raise ValueError("factorial() not defined for negative values")
    r = 1
    for i in range(2, n + 1):
        r *= i
    return r
def gcd(*ns):
    g = 0
    for n in ns:
        a, b = abs(g), abs(n)
        while b:
            a, b = b, a % b
        g = a
    return g
def lcm(*ns):
    r = 1
    for n in ns:
        if n == 0:
            return 0
        r = abs(r * n) // gcd(r, n)
    return r
def comb(n, k):
    if k < 0 or k > n:
        return 0
    return factorial(n) // (factorial(k) * factorial(n - k))
def perm(n, k=None):
    if k is None:
        k = n
    if k < 0 or k > n:
        return 0
    return factorial(n) // factorial(n - k)
def prod(xs, start=1):
    r = start
    for v in xs:
        r *= v
    return r
def fsum(xs):
    return float(sum(xs))
def isclose(a, b, rel_tol=1e-09, abs_tol=0.0):
    return abs(a - b) <= max(rel_tol * max(abs(a), abs(b)), abs_tol)
def isnan(x): return x != x
def isinf(x): return x == inf or x == -inf
def isfinite(x): return not (isnan(x) or isinf(x))
def copysign(x, y): return abs(float(x)) if y >= 0 else -abs(float(x))
`,
random:`import javascript as _js
_state = [int(_js.Date.now()) % 2147483647 or 1]
def seed(a=None):
    if a is None:
        a = int(_js.Date.now())
    if isinstance(a, str):
        h = 0
        for ch in a:
            h = (h * 31 + ord(ch)) % 2147483647
        a = h
    _state[0] = (int(a) % 2147483646) + 1
def random():
    _state[0] = (_state[0] * 48271) % 2147483647
    return (_state[0] - 1) / 2147483646
def randint(a, b):
    if a > b:
        raise ValueError("empty range in randint(" + str(a) + ", " + str(b) + ")")
    return a + int(random() * (b - a + 1))
def randrange(start, stop=None, step=1):
    if stop is None:
        start, stop = 0, start
    n = (stop - start + step - (1 if step > 0 else -1)) // step
    if n <= 0:
        raise ValueError("empty range for randrange()")
    return start + step * int(random() * n)
def choice(seq):
    if len(seq) == 0:
        raise IndexError("Cannot choose from an empty sequence")
    return seq[int(random() * len(seq))]
def choices(population, weights=None, k=1):
    if weights is None:
        return [choice(population) for _ in range(k)]
    total = sum(weights)
    out = []
    for _ in range(k):
        r = random() * total
        acc = 0
        for item, w in zip(population, weights):
            acc += w
            if r < acc:
                out.append(item)
                break
        else:
            out.append(population[-1])
    return out
def shuffle(x):
    for i in range(len(x) - 1, 0, -1):
        j = int(random() * (i + 1))
        x[i], x[j] = x[j], x[i]
def sample(population, k):
    pool = list(population)
    if k > len(pool):
        raise ValueError("Sample larger than population or is negative")
    shuffle(pool)
    return pool[:k]
def uniform(a, b):
    return a + (b - a) * random()
`,
time:`import javascript as _js
def time():
    return _js.Date.now() / 1000
def perf_counter():
    return _js.Date.now() / 1000
def monotonic():
    return perf_counter()
def sleep(seconds):
    # TypeMonkey runs your program all at once, so sleep doesn't actually wait.
    if seconds < 0:
        raise ValueError("sleep length must be non-negative")
`,
string:`ascii_lowercase = "abcdefghijklmnopqrstuvwxyz"
ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
ascii_letters = ascii_lowercase + ascii_uppercase
digits = "0123456789"
hexdigits = "0123456789abcdefABCDEF"
octdigits = "01234567"
punctuation = "!\\"#$%&'()*+,-./:;<=>?@[\\\\]^_\`{|}~"
whitespace = " \\t\\n\\r\\x0b\\x0c"
printable = digits + ascii_letters + punctuation + whitespace
def capwords(s, sep=None):
    return (sep or " ").join(w.capitalize() for w in s.split(sep))
`,
collections:`class Counter(dict):
    def __init__(self, iterable=None, **kw):
        dict.__init__(self)
        self.update(iterable, **kw)
    def __missing__(self, key):
        return 0
    def update(self, iterable=None, **kw):
        if iterable is not None:
            if isinstance(iterable, dict):
                for k, v in iterable.items():
                    self[k] = self.get(k, 0) + v
            else:
                for k in iterable:
                    self[k] = self.get(k, 0) + 1
        for k, v in kw.items():
            self[k] = self.get(k, 0) + v
    def most_common(self, n=None):
        items = sorted(self.items(), key=lambda kv: -kv[1])
        return items if n is None else items[:n]
    def total(self):
        return sum(self.values())
    def elements(self):
        for k, v in self.items():
            for _ in range(v):
                yield k
    def __repr__(self):
        if not self:
            return "Counter()"
        return "Counter({" + ", ".join(repr(k) + ": " + repr(v) for k, v in self.most_common()) + "})"
class defaultdict(dict):
    def __init__(self, default_factory=None, *args):
        dict.__init__(self, *args)
        self.default_factory = default_factory
    def __missing__(self, key):
        if self.default_factory is None:
            raise KeyError(key)
        v = self.default_factory()
        self[key] = v
        return v
    def __getitem__(self, key):
        if key in self:
            return dict.__getitem__(self, key)
        return self.__missing__(key)
    def __repr__(self):
        name = getattr(self.default_factory, "__name__", repr(self.default_factory))
        return "defaultdict(<class '" + name + "'>, " + dict.__repr__(self) + ")"
class deque:
    def __init__(self, iterable=(), maxlen=None):
        self._d = []
        self.maxlen = maxlen
        for x in iterable:
            self.append(x)
    def append(self, x):
        self._d.append(x)
        if self.maxlen is not None and len(self._d) > self.maxlen:
            self._d.pop(0)
    def appendleft(self, x):
        self._d.insert(0, x)
        if self.maxlen is not None and len(self._d) > self.maxlen:
            self._d.pop()
    def pop(self):
        if not self._d:
            raise IndexError("pop from an empty deque")
        return self._d.pop()
    def popleft(self):
        if not self._d:
            raise IndexError("pop from an empty deque")
        return self._d.pop(0)
    def extend(self, xs):
        for x in xs:
            self.append(x)
    def extendleft(self, xs):
        for x in xs:
            self.appendleft(x)
    def rotate(self, n=1):
        if self._d:
            n = n % len(self._d)
            self._d = self._d[-n:] + self._d[:-n]
    def clear(self):
        self._d = []
    def __len__(self): return len(self._d)
    def __iter__(self): return iter(self._d)
    def __getitem__(self, i): return self._d[i]
    def __setitem__(self, i, v): self._d[i] = v
    def __bool__(self): return len(self._d) > 0
    def __eq__(self, other): return isinstance(other, deque) and self._d == other._d
    def __repr__(self):
        return "deque(" + repr(self._d) + ("" if self.maxlen is None else ", maxlen=" + str(self.maxlen)) + ")"
def namedtuple(typename, field_names):
    if isinstance(field_names, str):
        field_names = field_names.replace(",", " ").split()
    fields = list(field_names)
    def __init__(self, *args, **kw):
        vals = list(args)
        for f in fields[len(vals):]:
            if f not in kw:
                raise TypeError(typename + "() missing argument: '" + f + "'")
            vals.append(kw[f])
        for f, v in zip(fields, vals):
            object.__setattr__(self, f, v)
        object.__setattr__(self, "_vals", tuple(vals))
    def __repr__(self):
        return typename + "(" + ", ".join(f + "=" + repr(getattr(self, f)) for f in fields) + ")"
    def __iter__(self): return iter(self._vals)
    def __getitem__(self, i): return self._vals[i]
    def __len__(self): return len(fields)
    def __eq__(self, other): return tuple(self) == tuple(other)
    def __hash__(self): return hash(self._vals)
    def _asdict(self): return {f: getattr(self, f) for f in fields}
    def _replace(self, **kw):
        d = self._asdict()
        d.update(kw)
        return cls(**d)
    cls = type(typename, (), {"__init__": __init__, "__repr__": __repr__, "__iter__": __iter__, "__getitem__": __getitem__,
                              "__len__": __len__, "__eq__": __eq__, "__hash__": __hash__, "_asdict": _asdict, "_replace": _replace, "_fields": tuple(fields)})
    return cls
OrderedDict = dict
`,
itertools:`def count(start=0, step=1):
    n = start
    while True:
        yield n
        n += step
def cycle(iterable):
    saved = list(iterable)
    while saved:
        for x in saved:
            yield x
def repeat(obj, times=None):
    if times is None:
        while True:
            yield obj
    else:
        for _ in range(times):
            yield obj
def chain(*its):
    for it in its:
        for x in it:
            yield x
def islice(iterable, *args):
    s = slice(*args)
    start, stop, step = s.start or 0, s.stop, s.step or 1
    i = 0
    nxt = start
    for x in iterable:
        if stop is not None and i >= stop:
            return
        if i == nxt:
            yield x
            nxt += step
        i += 1
def accumulate(iterable, func=None, initial=None):
    it = iter(iterable)
    total = initial
    if total is None:
        try:
            total = next(it)
        except StopIteration:
            return
    yield total
    for x in it:
        total = total + x if func is None else func(total, x)
        yield total
def product(*its, repeat=1):
    pools = [list(p) for p in its] * repeat
    result = [[]]
    for pool in pools:
        result = [r + [y] for r in result for y in pool]
    for r in result:
        yield tuple(r)
def permutations(iterable, r=None):
    pool = list(iterable)
    n = len(pool)
    r = n if r is None else r
    def rec(prefix, used):
        if len(prefix) == r:
            yield tuple(prefix)
            return
        for i in range(n):
            if not used[i]:
                used[i] = True
                yield from rec(prefix + [pool[i]], used)
                used[i] = False
    if r <= n:
        yield from rec([], [False] * n)
def combinations(iterable, r):
    pool = list(iterable)
    n = len(pool)
    def rec(start, prefix):
        if len(prefix) == r:
            yield tuple(prefix)
            return
        for i in range(start, n):
            yield from rec(i + 1, prefix + [pool[i]])
    yield from rec(0, [])
def zip_longest(*its, fillvalue=None):
    lists = [list(i) for i in its]
    n = max((len(l) for l in lists), default=0)
    for i in range(n):
        yield tuple(l[i] if i < len(l) else fillvalue for l in lists)
def groupby(iterable, key=None):
    key = key or (lambda x: x)
    group, cur = [], object()
    first = True
    for x in iterable:
        k = key(x)
        if first or k != cur:
            if not first:
                yield cur, iter(group)
            group, cur, first = [x], k, False
        else:
            group.append(x)
    if not first:
        yield cur, iter(group)
`,
functools:`def reduce(func, iterable, *initial):
    it = iter(iterable)
    if initial:
        acc = initial[0]
    else:
        try:
            acc = next(it)
        except StopIteration:
            raise TypeError("reduce() of empty iterable with no initial value")
    for x in it:
        acc = func(acc, x)
    return acc
def lru_cache(maxsize=128):
    def deco(f):
        memo = {}
        def wrapper(*args):
            if args in memo:
                return memo[args]
            r = f(*args)
            memo[args] = r
            return r
        wrapper.__name__ = getattr(f, "__name__", "wrapper")
        wrapper.cache_clear = memo.clear
        return wrapper
    if callable(maxsize):
        return deco(maxsize)
    return deco
cache = lru_cache
def partial(func, *pargs, **pkw):
    def wrapper(*args, **kw):
        d = dict(pkw)
        d.update(kw)
        return func(*(pargs + args), **d)
    return wrapper
def wraps(wrapped):
    def deco(f):
        try:
            f.__name__ = wrapped.__name__
        except Exception:
            pass
        return f
    return deco
def cmp_to_key(cmp):
    class K:
        def __init__(self, obj): self.obj = obj
        def __lt__(self, other): return cmp(self.obj, other.obj) < 0
        def __gt__(self, other): return cmp(self.obj, other.obj) > 0
        def __eq__(self, other): return cmp(self.obj, other.obj) == 0
    return K
`,
json:`def _esc(s):
    out = '"'
    for ch in s:
        if ch == '"': out += '\\\\"'
        elif ch == '\\\\': out += '\\\\\\\\'
        elif ch == '\\n': out += '\\\\n'
        elif ch == '\\t': out += '\\\\t'
        else: out += ch
    return out + '"'
def dumps(obj, indent=None, sort_keys=False):
    def enc(o, lvl):
        pad = "" if indent is None else "\\n" + " " * (indent * (lvl + 1))
        end = "" if indent is None else "\\n" + " " * (indent * lvl)
        sep = ", " if indent is None else ","
        if o is None: return "null"
        if o is True: return "true"
        if o is False: return "false"
        if isinstance(o, (int, float)): return repr(o)
        if isinstance(o, str): return _esc(o)
        if isinstance(o, (list, tuple)):
            if not o: return "[]"
            return "[" + sep.join(pad + enc(x, lvl + 1) for x in o) + end + "]"
        if isinstance(o, dict):
            if not o: return "{}"
            keys = sorted(o.keys()) if sort_keys else list(o.keys())
            return "{" + sep.join(pad + _esc(str(k)) + ": " + enc(o[k], lvl + 1) for k in keys) + end + "}"
        raise TypeError("Object of type " + type(o).__name__ + " is not JSON serializable")
    return enc(obj, 0)
def loads(s):
    i = [0]
    def ws():
        while i[0] < len(s) and s[i[0]] in " \\t\\n\\r": i[0] += 1
    def val():
        ws()
        c = s[i[0]] if i[0] < len(s) else ""
        if c == "{":
            i[0] += 1; d = {}; ws()
            if s[i[0]] == "}": i[0] += 1; return d
            while True:
                ws(); k = string(); ws(); i[0] += 1; d[k] = val(); ws()
                if s[i[0]] == ",": i[0] += 1; continue
                i[0] += 1; return d
        if c == "[":
            i[0] += 1; a = []; ws()
            if s[i[0]] == "]": i[0] += 1; return a
            while True:
                a.append(val()); ws()
                if s[i[0]] == ",": i[0] += 1; continue
                i[0] += 1; return a
        if c == '"': return string()
        for word, v in (("true", True), ("false", False), ("null", None)):
            if s.startswith(word, i[0]): i[0] += len(word); return v
        j = i[0]
        while j < len(s) and s[j] in "-+.0123456789eE": j += 1
        if j == i[0]: raise ValueError("Expecting value: char " + str(i[0]))
        t = s[i[0]:j]; i[0] = j
        return float(t) if any(ch in t for ch in ".eE") else int(t)
    def string():
        i[0] += 1; out = ""
        while s[i[0]] != '"':
            if s[i[0]] == "\\\\":
                i[0] += 1; out += {"n": "\\n", "t": "\\t", '"': '"', "\\\\": "\\\\", "/": "/"}.get(s[i[0]], s[i[0]])
            else:
                out += s[i[0]]
            i[0] += 1
        i[0] += 1
        return out
    r = val(); ws()
    if i[0] != len(s): raise ValueError("Extra data: char " + str(i[0]))
    return r
`,
dataclasses:`_MISSING = object()
class _Field:
    def __init__(self, default=_MISSING, default_factory=None):
        self.default = default
        self.default_factory = default_factory
def field(default=_MISSING, default_factory=None):
    return _Field(default, default_factory)
def dataclass(cls=None, frozen=False, order=False):
    def wrap(cls):
        ann = getattr(cls, "__annotations__", None) or cls.__dict__.get("__annotations__", {})
        names = list(ann.keys())
        defaults = {}
        for n in names:
            if n in cls.__dict__:
                defaults[n] = cls.__dict__[n]
        def __init__(self, *args, **kw):
            if len(args) > len(names):
                raise TypeError(cls.__name__ + "() takes " + str(len(names)) + " arguments")
            for i, n in enumerate(names):
                if i < len(args):
                    v = args[i]
                elif n in kw:
                    v = kw[n]
                elif n in defaults:
                    d = defaults[n]
                    if isinstance(d, _Field):
                        v = d.default_factory() if d.default_factory else d.default
                    else:
                        v = d
                else:
                    raise TypeError(cls.__name__ + "() missing 1 required argument: '" + n + "'")
                object.__setattr__(self, n, v)
            if hasattr(self, "__post_init__"):
                self.__post_init__()
        def __repr__(self):
            return cls.__name__ + "(" + ", ".join(n + "=" + repr(getattr(self, n)) for n in names) + ")"
        def __eq__(self, other):
            return type(other) is type(self) and all(getattr(self, n) == getattr(other, n) for n in names)
        cls.__init__ = __init__
        if "__repr__" not in cls.__dict__:
            cls.__repr__ = __repr__
        cls.__eq__ = __eq__
        if order:
            cls.__lt__ = lambda a, b: tuple(getattr(a, n) for n in names) < tuple(getattr(b, n) for n in names)
        if frozen:
            def __setattr__(self, n, v):
                raise AttributeError("cannot assign to field '" + n + "'")
            cls.__setattr__ = __setattr__
            cls.__hash__ = lambda self: hash(tuple(getattr(self, n) for n in names))
        return cls
    if cls is None:
        return wrap
    return wrap(cls)
def asdict(obj):
    return {n: getattr(obj, n) for n in (getattr(obj.__class__, "__annotations__", None) or {})}
`,
};
