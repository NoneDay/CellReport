declare namespace Enumerable {
    export var Utils: {
      createLambda(expression: any): (...params: any[]) => any;
      createEnumerable<T>(getEnumerator: () => IEnumerator<T>): IEnumerable<T>;
      createEnumerator<T>(initialize: () => void, tryGetNext: () => boolean, dispose: () => void): IEnumerator<T>;
      extendTo(type: any): void;
      hasNativeIteratorSupport(): boolean;
    };
    export function choice<T>(...params: T[]): IEnumerable<T>;
    export function cycle<T>(...params: T[]): IEnumerable<T>;
    export function empty<T>(): IEnumerable<T>;
    // from<T>, obj as JScript's IEnumerable or WinMD IIterable<T> is IEnumerable<T> but it can't define.
    export function from(): IEnumerable<any>; // empty
    export function from<T>(obj: IEnumerable<T>): IEnumerable<T>;
    export function from(obj: number): IEnumerable<number>;
    export function from(obj: boolean): IEnumerable<boolean>;
    export function from(obj: string): IEnumerable<string>;
    export function from<T>(obj: T[]): IEnumerable<T>;
    export function from<T>(obj: { length: number;[x: number]: T; }): IEnumerable<T>;
    export function from(obj: any): IEnumerable<{ key: string; value: any }>;
    export function make<T>(element: T): IEnumerable<T>;
    export function matches<T>(input: string, pattern: RegExp): IEnumerable<T>;
    export function matches<T>(input: string, pattern: string, flags?: string): IEnumerable<T>;
    export function range(start: number, count: number, step?: number): IEnumerable<number>;
    export function rangeDown(start: number, count: number, step?: number): IEnumerable<number>;
    export function rangeTo(start: number, to: number, step?: number): IEnumerable<number>;
    export function repeat<T>(element: T, count?: number): IEnumerable<T>;
    export function repeatWithFinalize<T>(initializer: () => T, finalizer: (element: T) => void): IEnumerable<T>;
    export function generate<T>(func: () => T, count?: number): IEnumerable<T>;
    export function toInfinity(start?: number, step?: number): IEnumerable<number>;
    export function toNegativeInfinity(start?: number, step?: number): IEnumerable<number>;
    export function unfold<T>(seed: T, func: (value: T) => T): IEnumerable<T>;
    export function defer<T>(enumerableFactory: () => IEnumerable<T>): IEnumerable<T>;
  
    export interface IEnumerable<T> extends Iterable<T> {
      constructor(getEnumerator: () => IEnumerator<T>): IEnumerable<T>;
      getEnumerator(): IEnumerator<T>;
  
      // Extension Methods
      traverseBreadthFirst(childrenSelector: (element: T) => IEnumerable<T>): IEnumerable<T>;
      traverseBreadthFirst<TResult>(childrenSelector: (element: T) => IEnumerable<T>, resultSelector: (element: T, nestLevel: number) => TResult): IEnumerable<TResult>;
      traverseDepthFirst<TResult>(childrenSelector: (element: T) => IEnumerable<T>): IEnumerable<T>;
      traverseDepthFirst<TResult>(childrenSelector: (element: T) => IEnumerable<T>, resultSelector?: (element: T, nestLevel: number) => TResult): IEnumerable<TResult>;
      flatten(): IEnumerable<any>;
      pairwise<TResult>(selector: (prev: T, current: T) => TResult): IEnumerable<TResult>;
      scan(func: (prev: T, current: T) => T): IEnumerable<T>;
      scan<TAccumulate>(seed: TAccumulate, func: (prev: TAccumulate, current: T) => TAccumulate): IEnumerable<TAccumulate>;
      select<TResult>(selector: (element: T, index: number) => TResult): IEnumerable<TResult>;
      selectMany<TOther>(collectionSelector: (element: T, index: number) => IEnumerable<TOther>): IEnumerable<TOther>;
      selectMany<TCollection, TResult>(collectionSelector: (element: T, index: number) => IEnumerable<TCollection>, resultSelector: (outer: T, inner: TCollection) => TResult): IEnumerable<TResult>;
      selectMany<TOther>(collectionSelector: (element: T, index: number) => TOther[]): IEnumerable<TOther>;
      selectMany<TCollection, TResult>(collectionSelector: (element: T, index: number) => TCollection[], resultSelector: (outer: T, inner: TCollection) => TResult): IEnumerable<TResult>;
      selectMany<TOther>(collectionSelector: (element: T, index: number) => { length: number;[x: number]: TOther; }): IEnumerable<TOther>;
      selectMany<TCollection, TResult>(collectionSelector: (element: T, index: number) => { length: number;[x: number]: TCollection; }, resultSelector: (outer: T, inner: TCollection) => TResult): IEnumerable<TResult>;
      where(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
      choose(selector: (element: T, index: number) => T): IEnumerable<T>;
      ofType<TResult>(type: any): IEnumerable<TResult>;
      zip<U, TResult>(second: IEnumerable<U>, resultSelector: (first: T, second: U, index: number) => TResult): IEnumerable<TResult>;
      zip<U, TResult>(second: { length: number;[x: number]: U; }, resultSelector: (first: T, second: U, index: number) => TResult): IEnumerable<TResult>;
      zip<U, TResult>(second: U[], resultSelector: (first: T, second: U, index: number) => TResult): IEnumerable<TResult>;
      zip<TResult>(...params: any[]): IEnumerable<TResult>; // last one is selector
      merge<TResult>(...params: IEnumerable<T>[]): IEnumerable<T>;
      merge<TResult>(...params: { length: number;[x: number]: T; }[]): IEnumerable<T>;
      merge<TResult>(...params: T[][]): IEnumerable<T>;
      join<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
      join<TInner, TKey, TResult>(inner: { length: number;[x: number]: TInner; }, outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
      join<TInner, TKey, TResult>(inner: TInner[], outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
      groupJoin<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
      groupJoin<TInner, TKey, TResult>(inner: { length: number;[x: number]: TInner; }, outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
      groupJoin<TInner, TKey, TResult>(inner: TInner[], outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
      all(predicate: (element: T) => boolean): boolean;
      any(predicate?: (element: T) => boolean): boolean;
      isEmpty(): boolean;
      concat(...sequences: IEnumerable<T>[]): IEnumerable<T>;
      concat(...sequences: { length: number;[x: number]: T; }[]): IEnumerable<T>;
      concat(...sequences: T[]): IEnumerable<T>;
      insert(index: number, second: IEnumerable<T>): IEnumerable<T>;
      insert(index: number, second: { length: number;[x: number]: T; }): IEnumerable<T>;
      alternate(alternateValue: T): IEnumerable<T>;
      alternate(alternateSequence: { length: number;[x: number]: T; }): IEnumerable<T>;
      alternate(alternateSequence: IEnumerable<T>): IEnumerable<T>;
      alternate(alternateSequence: T[]): IEnumerable<T>;
      contains(value: T): boolean;
      contains<TCompare>(value: T, compareSelector?: (element: T) => TCompare): boolean;
      defaultIfEmpty(defaultValue?: T): IEnumerable<T>;
      distinct(): IEnumerable<T>;
      distinct<TCompare>(compareSelector: (element: T) => TCompare): IEnumerable<T>;
      distinctUntilChanged(): IEnumerable<T>;
      distinctUntilChanged<TCompare>(compareSelector: (element: T) => TCompare): IEnumerable<T>;
      except(second: { length: number;[x: number]: T; }): IEnumerable<T>;
      except<TCompare>(second: { length: number;[x: number]: T; }, compareSelector: (element: T) => TCompare): IEnumerable<T>;
      except(second: IEnumerable<T>): IEnumerable<T>;
      except<TCompare>(second: IEnumerable<T>, compareSelector: (element: T) => TCompare): IEnumerable<T>;
      except(second: T[]): IEnumerable<T>;
      except<TCompare>(second: T[], compareSelector: (element: T) => TCompare): IEnumerable<T>;
      intersect(second: { length: number;[x: number]: T; }): IEnumerable<T>;
      intersect<TCompare>(second: { length: number;[x: number]: T; }, compareSelector: (element: T) => TCompare): IEnumerable<T>;
      intersect(second: IEnumerable<T>): IEnumerable<T>;
      intersect<TCompare>(second: IEnumerable<T>, compareSelector: (element: T) => TCompare): IEnumerable<T>;
      intersect(second: T[]): IEnumerable<T>;
      intersect<TCompare>(second: T[], compareSelector: (element: T) => TCompare): IEnumerable<T>;
      union(second: { length: number;[x: number]: T; }): IEnumerable<T>;
      union<TCompare>(second: { length: number;[x: number]: T; }, compareSelector: (element: T) => TCompare): IEnumerable<T>;
      union(second: IEnumerable<T>): IEnumerable<T>;
      union<TCompare>(second: IEnumerable<T>, compareSelector: (element: T) => TCompare): IEnumerable<T>;
      union(second: T[]): IEnumerable<T>;
      union<TCompare>(second: T[], compareSelector: (element: T) => TCompare): IEnumerable<T>;
      sequenceEqual(second: { length: number;[x: number]: T; }): boolean;
      sequenceEqual<TCompare>(second: { length: number;[x: number]: T; }, compareSelector: (element: T) => TCompare): boolean;
      sequenceEqual(second: IEnumerable<T>): boolean;
      sequenceEqual<TCompare>(second: IEnumerable<T>, compareSelector: (element: T) => TCompare): boolean;
      sequenceEqual(second: T[]): boolean;
      sequenceEqual<TCompare>(second: T[], compareSelector: (element: T) => TCompare): boolean;
      orderBy<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
      orderBy<TKey>(keySelector: (element: T) => TKey, comparer: (first: T, second: T) => number): IOrderedEnumerable<T>;
      orderByDescending<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
      orderByDescending<TKey>(keySelector: (element: T) => TKey, comparer: (first: T, second: T) => number): IOrderedEnumerable<T>;
      reverse(): IEnumerable<T>;
      shuffle(): IEnumerable<T>;
      weightedSample(weightSelector: (element: T) => number): IEnumerable<T>;
      groupBy<TKey>(keySelector: (element: T) => TKey): IEnumerable<IGrouping<TKey, T>>;
      groupBy<TKey, TElement>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement): IEnumerable<IGrouping<TKey, TElement>>;
      groupBy<TKey, TElement, TResult>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult): IEnumerable<TResult>;
      groupBy<TKey, TElement, TResult, TCompare>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult, compareSelector: (element: TKey) => TCompare): IEnumerable<TResult>;
      // :IEnumerable<IGrouping<TKey, T>>
      partitionBy<TKey>(keySelector: (element: T) => TKey): IEnumerable<IGrouping<TKey, any>>;
      // :IEnumerable<IGrouping<TKey, TElement>>
      partitionBy<TKey, TElement>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement): IEnumerable<IGrouping<TKey, TElement>>;
      partitionBy<TKey, TElement, TResult>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult): IEnumerable<TResult>;
      partitionBy<TKey, TElement, TResult, TCompare>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult, compareSelector: (element: TKey) => TCompare): IEnumerable<TResult>;
      buffer(count: number): IEnumerable<T[]>;
      aggregate(func: (prev: T, current: T) => T): T;
      aggregate<TAccumulate>(seed: TAccumulate, func: (prev: TAccumulate, current: T) => TAccumulate): TAccumulate;
      aggregate<TAccumulate, TResult>(seed: TAccumulate, func: (prev: TAccumulate, current: T) => TAccumulate, resultSelector: (last: TAccumulate) => TResult): TResult;
      average(selector?: (element: T) => number): number;
      count(predicate?: (element: T, index: number) => boolean): number;
      max(selector?: (element: T) => number): number;
      min(selector?: (element: T) => number): number;
      maxBy<TKey>(keySelector: (element: T) => TKey): T;
      minBy<TKey>(keySelector: (element: T) => TKey): T;
      sum(selector?: (element: T) => number): number;
      elementAt(index: number): T;
      elementAtOrDefault(index: number, defaultValue?: T): T;
      first(predicate?: (element: T, index: number) => boolean): T;
      firstOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
      firstOrDefault(defaultValue?: T): T;
      last(predicate?: (element: T, index: number) => boolean): T;
      lastOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
      lastOrDefault(defaultValue?: T): T;
      single(predicate?: (element: T, index: number) => boolean): T;
      singleOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
      skip(count: number): IEnumerable<T>;
      skipWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
      take(count: number): IEnumerable<T>;
      takeWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
      takeExceptLast(count?: number): IEnumerable<T>;
      takeFromLast(count: number): IEnumerable<T>;
      indexOf(item: T): number;
      indexOf(predicate: (element: T, index: number) => boolean): number;
      lastIndexOf(item: T): number;
      lastIndexOf(predicate: (element: T, index: number) => boolean): number;
      asEnumerable(): IEnumerable<T>;
      cast<TResult>(): IEnumerable<TResult>;
      toArray(): T[];
      toLookup<TKey>(keySelector: (element: T) => TKey): ILookup<TKey, T>;
      toLookup<TKey, TElement>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement): ILookup<TKey, TElement>;
      toLookup<TKey, TElement, TCompare>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, compareSelector: (key: TKey) => TCompare): ILookup<TKey, TElement>;
      toObject(keySelector: (element: T) => any, elementSelector?: (element: T) => any): Object;
      // :IDictionary<TKey, T>
      toDictionary<TKey>(keySelector: (element: T) => TKey): IDictionary<TKey, any>;
      toDictionary<TKey, TValue>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TValue): IDictionary<TKey, TValue>;
      toDictionary<TKey, TValue, TCompare>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TValue, compareSelector: (key: TKey) => TCompare): IDictionary<TKey, TValue>;
      toJSONString(replacer: (key: string, value: any) => any): string;
      toJSONString(replacer: any[]): string;
      toJSONString(replacer: (key: string, value: any) => any, space: any): string;
      toJSONString(replacer: any[], space: any): string;
      toJoinedString(separator?: string): string;
      toJoinedString<TResult>(separator: string, selector: (element: T, index: number) => TResult): string;
      doAction(action: (element: T, index: number) => void): IEnumerable<T>;
      doAction(action: (element: T, index: number) => boolean): IEnumerable<T>;
      forEach(action: (element: T, index: number) => void): void;
      forEach(action: (element: T, index: number) => boolean): void;
      write(separator?: string): void;
      write<TResult>(separator: string, selector: (element: T) => TResult): void;
      writeLine(): void;
      writeLine<TResult>(selector: (element: T) => TResult): void;
      force(): void;
      letBind<TResult>(func: (source: IEnumerable<T>) => { length: number;[x: number]: TResult; }): IEnumerable<TResult>;
      letBind<TResult>(func: (source: IEnumerable<T>) => TResult[]): IEnumerable<TResult>;
      letBind<TResult>(func: (source: IEnumerable<T>) => IEnumerable<TResult>): IEnumerable<TResult>;
      share(): IDisposableEnumerable<T>;
      memoize(): IDisposableEnumerable<T>;
      catchError(handler: (exception: any) => void): IEnumerable<T>;
      finallyAction(finallyAction: () => void): IEnumerable<T>;
      log(): IEnumerable<T>;
      log<TValue>(selector: (element: T) => TValue): IEnumerable<T>;
      trace(message?: string): IEnumerable<T>;
      trace<TValue>(message: string, selector: (element: T) => TValue): IEnumerable<T>;
    }
  
    export interface IEnumerator<T> {
      current(): T;
      moveNext(): boolean;
      dispose(): void;
    }
  
    export interface IOrderedEnumerable<T> extends IEnumerable<T> {
      createOrderedEnumerable<TKey>(keySelector: (element: T) => TKey, comparer: (first: T, second: T) => number, descending: boolean): IOrderedEnumerable<T>;
      thenBy<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
      thenBy<TKey>(keySelector: (element: T) => TKey, comparer: (first: T, second: T) => number): IOrderedEnumerable<T>;
      thenByDescending<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
      thenByDescending<TKey>(keySelector: (element: T) => TKey, comparer: (first: T, second: T) => number): IOrderedEnumerable<T>;
    }
  
    export interface IDisposableEnumerable<T> extends IEnumerable<T> {
      dispose(): void;
    }
  
    export interface IDictionary<TKey, TValue> {
      add(key: TKey, value: TValue): void;
      get(key: TKey): TValue;
      set(key: TKey, value: TValue): boolean;
      contains(key: TKey): boolean;
      clear(): void;
      remove(key: TKey): void;
      count(): number;
      toEnumerable(): IEnumerable<{ key: TKey; value: TValue }>;
    }
  
    export interface ILookup<TKey, TElement> {
      count(): number;
      get(key: TKey): IEnumerable<TElement>;
      contains(key: TKey): boolean;
      toEnumerable(): IEnumerable<IGrouping<TKey, TElement>>;
    }
  
    export interface IGrouping<TKey, TElement> extends IEnumerable<TElement> {
      key(): TKey;
      getSource(): TElement[];
    }
  }
  
  
declare class Query {
    /** */
    AddComponent( component:String, clause:AbstractClause, engineCode:String=null):Query
    /** */
    AddOrReplaceComponent( component:String, clause:AbstractClause, engineCode:String=null):Query
    /** */
    Aggregate( aggregateOperation:String, columns:String[], transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    As( alias:String):Query
    /** */
    AsAggregate( type:String, columns:String[]=null):Query
    /** */
    AsAverage( column:String):Query
    /** */
    AsAvg( column:String):Query
    /** */
    AsCount( columns:String[]=null):Query
    /** */
    AsDecrement( column:String, value:number=1):Query
    /** */
    AsDelete():Query
    /** */
    AsIncrement( column:String, value:number=1):Query
    /** */
    AsInsert( data:Object, returnId:Boolean=false):Query
    /** */
    AsInsert( columns:Enumerable.IEnumerable<T>, values:Enumerable.IEnumerable<T>):Query
    /** */
    AsInsert( values:Enumerable.IEnumerable<T>, returnId:Boolean=false):Query
    /** */
    AsInsert( columns:Enumerable.IEnumerable<T>, rowsValues:Enumerable.IEnumerable<T>):Query
    /** */
    AsInsert( columns:Enumerable.IEnumerable<T>, query:Query):Query
    /** */
    AsMax( column:String):Query
    /** */
    AsMin( column:String):Query
    /** */
    AsSum( column:String):Query
    /** */
    AsUpdate( data:Object):Query
    /** */
    AsUpdate( columns:Enumerable.IEnumerable<T>, values:Enumerable.IEnumerable<T>):Query
    /** */
    AsUpdate( values:Enumerable.IEnumerable<T>):Query
    /** */
    Average( column:String, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    Chunk( chunkSize:number, func:Func, transaction:IDbTransaction=null, timeout:Nullable=null):Void
    /** */
    Chunk( chunkSize:number, action:Action, transaction:IDbTransaction=null, timeout:Nullable=null):Void
    /** */
    Clauses:List
    /** */
    ClearComponent( component:String, engineCode:String=null):Query
    /** */
    Clone():Query
    /** */
    Combine( operation:String, all:Boolean, query:Query):Query
    /** */
    CombineRaw( sql:String, bindings:Object[]):Query
    /** */
    Comment( comment:String):Query
    /** */
    Count( columns:String[]=null, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    CrossJoin( table:String):Query
    /** */
    Decrement( column:String, value:number=1, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    Define( variable:String, value:Object):Query
    /** */
    Delete( transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    Distinct():Query
    /** */
    Except( query:Query, all:Boolean=false):Query
    /** */
    Except( callback:Func, all:Boolean=false):Query
    /** */
    ExceptAll( query:Query):Query
    /** */
    ExceptAll( callback:Func):Query
    /** */
    ExceptRaw( sql:String, bindings:Object[]):Query
    /** */
    Exists( transaction:IDbTransaction=null, timeout:Nullable=null):Boolean
    /** */
    FindVariable( variable:String):Object
    /** */
    First( transaction:IDbTransaction=null, timeout:Nullable=null):Object
    /** */
    FirstOrDefault( transaction:IDbTransaction=null, timeout:Nullable=null):Object
    /** */
    For( engine:String, fn:Func):Query
    /** */
    ForPage( page:number, perPage:number=15):Query
    /** */
    From( table:String):Query
    /** */
    From( query:Query, alias:String=null):Query
    /** */
    From( callback:Func, alias:String=null):Query
    /** */
    FromRaw( sql:String, bindings:Object[]):Query
    /** */
    Get( transaction:IDbTransaction=null, timeout:Nullable=null):Enumerable.IEnumerable<T>
    /** */
    GetComment():String
    /** */
    GetComponents( component:String, engineCode:String=null):List
    /** */
    GetHashCode():number
    /** */
    GetOneComponent( component:String, engineCode:String=null):AbstractClause
    /** */
    GroupBy( columns:String[]):Query
    /** */
    GroupByRaw( expression:String, bindings:Object[]):Query
    /** */
    HasComponent( component:String, engineCode:String=null):Boolean
    /** */
    HasLimit( engineCode:String=null):Boolean
    /** */
    HasOffset( engineCode:String=null):Boolean
    /** */
    Having( column:String, op:String, callback:Func):Query
    /** */
    Having( column:String, op:String, query:Query):Query
    /** */
    Having( column:String, op:String, value:Object):Query
    /** */
    Having( column:String, value:Object):Query
    /** */
    Having( constraints:Object):Query
    /** */
    Having( values:Enumerable.IEnumerable<T>):Query
    /** */
    Having( callback:Func):Query
    /** */
    HavingBetween( column:String, lower:T, higher:T):Query
    /** */
    HavingColumns( first:String, op:String, second:String):Query
    /** */
    HavingContains( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    HavingDate( column:String, op:String, value:Object):Query
    /** */
    HavingDate( column:String, value:Object):Query
    /** */
    HavingDatePart( part:String, column:String, op:String, value:Object):Query
    /** */
    HavingDatePart( part:String, column:String, value:Object):Query
    /** */
    HavingEnds( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    HavingExists( query:Query):Query
    /** */
    HavingExists( callback:Func):Query
    /** */
    HavingFalse( column:String):Query
    /** */
    HavingIn( column:String, values:Enumerable.IEnumerable<T>):Query
    /** */
    HavingIn( column:String, query:Query):Query
    /** */
    HavingIn( column:String, callback:Func):Query
    /** */
    HavingLike( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    HavingNot( column:String, op:String, value:Object):Query
    /** */
    HavingNot( column:String, value:Object):Query
    /** */
    HavingNot( callback:Func):Query
    /** */
    HavingNotBetween( column:String, lower:T, higher:T):Query
    /** */
    HavingNotContains( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    HavingNotDate( column:String, op:String, value:Object):Query
    /** */
    HavingNotDate( column:String, value:Object):Query
    /** */
    HavingNotDatePart( part:String, column:String, op:String, value:Object):Query
    /** */
    HavingNotDatePart( part:String, column:String, value:Object):Query
    /** */
    HavingNotEnds( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    HavingNotExists( query:Query):Query
    /** */
    HavingNotExists( callback:Func):Query
    /** */
    HavingNotIn( column:String, query:Query):Query
    /** */
    HavingNotIn( column:String, callback:Func):Query
    /** */
    HavingNotIn( column:String, values:Enumerable.IEnumerable<T>):Query
    /** */
    HavingNotLike( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    HavingNotNull( column:String):Query
    /** */
    HavingNotStarts( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    HavingNotTime( column:String, op:String, value:Object):Query
    /** */
    HavingNotTime( column:String, value:Object):Query
    /** */
    HavingNull( column:String):Query
    /** */
    HavingRaw( sql:String, bindings:Object[]):Query
    /** */
    HavingStarts( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    HavingTime( column:String, op:String, value:Object):Query
    /** */
    HavingTime( column:String, value:Object):Query
    /** */
    HavingTrue( column:String):Query
    /** */
    Include( relationName:String, query:Query, foreignKey:String=null, localKey:String="Id", isMany:Boolean=false):Query
    /** */
    IncludeMany( relationName:String, query:Query, foreignKey:String=null, localKey:String="Id"):Query
    /** */
    Increment( column:String, value:number=1, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    Insert( values:Enumerable.IEnumerable<T>, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    Insert( columns:Enumerable.IEnumerable<T>, valuesCollection:Enumerable.IEnumerable<T>, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    Insert( columns:Enumerable.IEnumerable<T>, fromQuery:Query, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    Insert( data:Object, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    InsertGetId( data:Object, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    InsertGetId( data:Enumerable.IEnumerable<T>, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    Intersect( query:Query, all:Boolean=false):Query
    /** */
    Intersect( callback:Func, all:Boolean=false):Query
    /** */
    IntersectAll( query:Query):Query
    /** */
    IntersectAll( callback:Func):Query
    /** */
    IntersectRaw( sql:String, bindings:Object[]):Query
    /** */
    IsDistinct:Boolean
    /** */
    Join( table:String, first:String, second:String, op:String="=", type:String="inner join"):Query
    /** */
    Join( table:String, callback:Func, type:String="inner join"):Query
    /** */
    Join( query:Query, onCallback:Func, type:String="inner join"):Query
    /** */
    LeftJoin( table:String, first:String, second:String, op:String="="):Query
    /** */
    LeftJoin( table:String, callback:Func):Query
    /** */
    LeftJoin( query:Query, onCallback:Func):Query
    /** */
    Limit( value:number):Query
    /** */
    Max( column:String, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    Min( column:String, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    NewChild():Query
    /** */
    NewQuery():Query
    /** */
    Not( flag:Boolean=true):Query
    /** */
    NotExist( transaction:IDbTransaction=null, timeout:Nullable=null):Boolean
    /** */
    Offset( value:Int64):Query
    /** */
    Offset( value:number):Query
    /** */
    Or():Query
    /** */
    OrderBy( columns:String[]):Query
    /** */
    OrderByDesc( columns:String[]):Query
    /** */
    OrderByRandom( seed:String):Query
    /** */
    OrderByRaw( expression:String, bindings:Object[]):Query
    /** */
    OrHaving( column:String, op:String, query:Query):Query
    /** */
    OrHaving( column:String, op:String, callback:Func):Query
    /** */
    OrHaving( column:String, op:String, value:Object):Query
    /** */
    OrHaving( column:String, value:Object):Query
    /** */
    OrHaving( callback:Func):Query
    /** */
    OrHavingBetween( column:String, lower:T, higher:T):Query
    /** */
    OrHavingColumns( first:String, op:String, second:String):Query
    /** */
    OrHavingContains( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrHavingDate( column:String, op:String, value:Object):Query
    /** */
    OrHavingDate( column:String, value:Object):Query
    /** */
    OrHavingDatePart( part:String, column:String, op:String, value:Object):Query
    /** */
    OrHavingDatePart( part:String, column:String, value:Object):Query
    /** */
    OrHavingEnds( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrHavingExists( query:Query):Query
    /** */
    OrHavingExists( callback:Func):Query
    /** */
    OrHavingFalse( column:String):Query
    /** */
    OrHavingIn( column:String, query:Query):Query
    /** */
    OrHavingIn( column:String, callback:Func):Query
    /** */
    OrHavingIn( column:String, values:Enumerable.IEnumerable<T>):Query
    /** */
    OrHavingLike( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrHavingNot( column:String, op:String, value:Object):Query
    /** */
    OrHavingNot( column:String, value:Object):Query
    /** */
    OrHavingNot( callback:Func):Query
    /** */
    OrHavingNotBetween( column:String, lower:T, higher:T):Query
    /** */
    OrHavingNotContains( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrHavingNotDate( column:String, op:String, value:Object):Query
    /** */
    OrHavingNotDate( column:String, value:Object):Query
    /** */
    OrHavingNotDatePart( part:String, column:String, op:String, value:Object):Query
    /** */
    OrHavingNotDatePart( part:String, column:String, value:Object):Query
    /** */
    OrHavingNotEnds( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrHavingNotExists( query:Query):Query
    /** */
    OrHavingNotExists( callback:Func):Query
    /** */
    OrHavingNotIn( column:String, query:Query):Query
    /** */
    OrHavingNotIn( column:String, callback:Func):Query
    /** */
    OrHavingNotIn( column:String, values:Enumerable.IEnumerable<T>):Query
    /** */
    OrHavingNotLike( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrHavingNotNull( column:String):Query
    /** */
    OrHavingNotStarts( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrHavingNotTime( column:String, op:String, value:Object):Query
    /** */
    OrHavingNotTime( column:String, value:Object):Query
    /** */
    OrHavingNull( column:String):Query
    /** */
    OrHavingRaw( sql:String, bindings:Object[]):Query
    /** */
    OrHavingStarts( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrHavingTime( column:String, op:String, value:Object):Query
    /** */
    OrHavingTime( column:String, value:Object):Query
    /** */
    OrHavingTrue( column:String):Query
    /** */
    OrWhere( column:String, op:String, value:Object):Query
    /** */
    OrWhere( column:String, value:Object):Query
    /** */
    OrWhere( callback:Func):Query
    /** */
    OrWhere( column:String, op:String, query:Query):Query
    /** */
    OrWhere( column:String, op:String, callback:Func):Query
    /** */
    OrWhereBetween( column:String, lower:T, higher:T):Query
    /** */
    OrWhereColumns( first:String, op:String, second:String):Query
    /** */
    OrWhereContains( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrWhereDate( column:String, op:String, value:Object):Query
    /** */
    OrWhereDate( column:String, value:Object):Query
    /** */
    OrWhereDatePart( part:String, column:String, op:String, value:Object):Query
    /** */
    OrWhereDatePart( part:String, column:String, value:Object):Query
    /** */
    OrWhereEnds( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrWhereExists( query:Query):Query
    /** */
    OrWhereExists( callback:Func):Query
    /** */
    OrWhereFalse( column:String):Query
    /** */
    OrWhereIn( column:String, values:Enumerable.IEnumerable<T>):Query
    /** */
    OrWhereIn( column:String, query:Query):Query
    /** */
    OrWhereIn( column:String, callback:Func):Query
    /** */
    OrWhereLike( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrWhereNot( column:String, op:String, value:Object):Query
    /** */
    OrWhereNot( column:String, value:Object):Query
    /** */
    OrWhereNot( callback:Func):Query
    /** */
    OrWhereNotBetween( column:String, lower:T, higher:T):Query
    /** */
    OrWhereNotContains( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrWhereNotDate( column:String, op:String, value:Object):Query
    /** */
    OrWhereNotDate( column:String, value:Object):Query
    /** */
    OrWhereNotDatePart( part:String, column:String, op:String, value:Object):Query
    /** */
    OrWhereNotDatePart( part:String, column:String, value:Object):Query
    /** */
    OrWhereNotEnds( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrWhereNotExists( query:Query):Query
    /** */
    OrWhereNotExists( callback:Func):Query
    /** */
    OrWhereNotIn( column:String, values:Enumerable.IEnumerable<T>):Query
    /** */
    OrWhereNotIn( column:String, query:Query):Query
    /** */
    OrWhereNotIn( column:String, callback:Func):Query
    /** */
    OrWhereNotLike( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrWhereNotNull( column:String):Query
    /** */
    OrWhereNotStarts( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrWhereNotTime( column:String, op:String, value:Object):Query
    /** */
    OrWhereNotTime( column:String, value:Object):Query
    /** */
    OrWhereNull( column:String):Query
    /** */
    OrWhereRaw( sql:String, bindings:Object[]):Query
    /** */
    OrWhereStarts( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    OrWhereSub( query:Query, value:Object):Query
    /** */
    OrWhereSub( query:Query, op:String, value:Object):Query
    /** */
    OrWhereTime( column:String, op:String, value:Object):Query
    /** */
    OrWhereTime( column:String, value:Object):Query
    /** */
    OrWhereTrue( column:String):Query
    /** */
    Paginate( page:number, perPage:number=25, transaction:IDbTransaction=null, timeout:Nullable=null):PaginationResult
    /** */
    Paginate( page:number, perPage:number=25, transaction:IDbTransaction=null, timeout:Nullable=null):PaginationResult
    /** */
    QueryAlias:String
    /** */
    RightJoin( table:String, first:String, second:String, op:String="="):Query
    /** */
    RightJoin( table:String, callback:Func):Query
    /** */
    RightJoin( query:Query, onCallback:Func):Query
    /** */
    Select( columns:String[]):Query
    /** */
    Select( columns:Enumerable.IEnumerable<T>):Query
    /** */
    Select( query:Query, alias:String):Query
    /** */
    Select( callback:Func, alias:String):Query
    /** */
    SelectRaw( sql:String, bindings:Object[]):Query
    /** */
    SetEngineScope( engine:String):Query
    /** */
    SetParent( parent:AbstractQuery):Query
    /** */
    Skip( offset:number):Query
    /** */
    Sum( column:String, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    Take( limit:number):Query
    /** */
    ToString():String
    /** */
    ToString():String
    /** */
    Union( query:Query, all:Boolean=false):Query
    /** */
    Union( callback:Func, all:Boolean=false):Query
    /** */
    UnionAll( query:Query):Query
    /** */
    UnionAll( callback:Func):Query
    /** */
    UnionRaw( sql:String, bindings:Object[]):Query
    /** */
    Update( values:Enumerable.IEnumerable<T>, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    Update( data:Object, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    When( condition:Boolean, whenTrue:Func, whenFalse:Func=null):Query
    /** */
    WhenNot( condition:Boolean, callback:Func):Query
    /** */
    Where( column:String, op:String, value:Object):Query
    /** */
    Where( column:String, value:Object):Query
    /** */
    Where( constraints:Object):Query
    /** */
    Where( values:Enumerable.IEnumerable<T>):Query
    /** */
    Where( callback:Func):Query
    /** */
    Where( column:String, op:String, callback:Func):Query
    /** */
    Where( column:String, op:String, query:Query):Query
    /** */
    WhereBetween( column:String, lower:T, higher:T):Query
    /** */
    WhereColumns( first:String, op:String, second:String):Query
    /** */
    WhereContains( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    WhereDate( column:String, op:String, value:Object):Query
    /** */
    WhereDate( column:String, value:Object):Query
    /** */
    WhereDatePart( part:String, column:String, op:String, value:Object):Query
    /** */
    WhereDatePart( part:String, column:String, value:Object):Query
    /** */
    WhereEnds( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    WhereExists( query:Query):Query
    /** */
    WhereExists( callback:Func):Query
    /** */
    WhereFalse( column:String):Query
    /** */
    WhereIn( column:String, values:Enumerable.IEnumerable<T>):Query
    /** */
    WhereIn( column:String, query:Query):Query
    /** */
    WhereIn( column:String, callback:Func):Query
    /** */
    WhereLike( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    WhereNot( column:String, op:String, value:Object):Query
    /** */
    WhereNot( column:String, value:Object):Query
    /** */
    WhereNot( callback:Func):Query
    /** */
    WhereNotBetween( column:String, lower:T, higher:T):Query
    /** */
    WhereNotContains( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    WhereNotDate( column:String, op:String, value:Object):Query
    /** */
    WhereNotDate( column:String, value:Object):Query
    /** */
    WhereNotDatePart( part:String, column:String, op:String, value:Object):Query
    /** */
    WhereNotDatePart( part:String, column:String, value:Object):Query
    /** */
    WhereNotEnds( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    WhereNotExists( query:Query):Query
    /** */
    WhereNotExists( callback:Func):Query
    /** */
    WhereNotIn( column:String, values:Enumerable.IEnumerable<T>):Query
    /** */
    WhereNotIn( column:String, query:Query):Query
    /** */
    WhereNotIn( column:String, callback:Func):Query
    /** */
    WhereNotLike( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    WhereNotNull( column:String):Query
    /** */
    WhereNotStarts( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    WhereNotTime( column:String, op:String, value:Object):Query
    /** */
    WhereNotTime( column:String, value:Object):Query
    /** */
    WhereNull( column:String):Query
    /** */
    WhereRaw( sql:String, bindings:Object[]):Query
    /** */
    WhereStarts( column:String, value:Object, caseSensitive:Boolean=false, escapeCharacter:String=null):Query
    /** */
    WhereSub( query:Query, value:Object):Query
    /** */
    WhereSub( query:Query, op:String, value:Object):Query
    /** */
    WhereTime( column:String, op:String, value:Object):Query
    /** */
    WhereTime( column:String, value:Object):Query
    /** */
    WhereTrue( column:String):Query
    /** */
    With( query:Query):Query
    /** */
    With( fn:Func):Query
    /** */
    With( alias:String, query:Query):Query
    /** */
    With( alias:String, fn:Func):Query
    /** */
    With( alias:String, columns:Enumerable.IEnumerable<T>, valuesCollection:Enumerable.IEnumerable<T>):Query
    /** */
    WithRaw( alias:String, sql:String, bindings:Object[]):Query

}
declare class KataClass {
    /** */
    Aggregate( query:Query, aggregateOperation:String, columns:String[]=null, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    Average( query:Query, column:String, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    Chunk( query:Query, chunkSize:number, func:Func, transaction:IDbTransaction=null, timeout:Nullable=null):Void
    /** */
    Chunk( query:Query, chunkSize:number, action:Action, transaction:IDbTransaction=null, timeout:Nullable=null):Void
    /** */
    Count( query:Query, columns:String[]=null, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    Execute( query:Query, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    ExecuteScalar( query:Query, transaction:IDbTransaction=null, timeout:Nullable=null):T
    /** */
    Exists( query:Query, transaction:IDbTransaction=null, timeout:Nullable=null):Boolean
    /** */
    First( query:Query, transaction:IDbTransaction=null, timeout:Nullable=null):Object
    /** */
    FirstOrDefault( query:Query, transaction:IDbTransaction=null, timeout:Nullable=null):Object
    /** */
    FromQuery( query:Query):Query
    /** */
    Get( query:Query, transaction:IDbTransaction=null, timeout:Nullable=null):Enumerable.IEnumerable<T>
    /** */
    Get( queries:Query[], transaction:IDbTransaction=null, timeout:Nullable=null):Enumerable.IEnumerable<T>
    /** */
    GetDictionary( query:Query, transaction:IDbTransaction=null, timeout:Nullable=null):Enumerable.IEnumerable<T>
    /** */
    GetMultiple( queries:Query[], transaction:IDbTransaction=null, timeout:Nullable=null)
    /** */
    Max( query:Query, column:String):T
    /** */
    Min( query:Query, column:String):T
    /** */
    Paginate( query:Query, page:number, perPage:number=25, transaction:IDbTransaction=null, timeout:Nullable=null):PaginationResult
    /** */
    Query( table:String):Query
    /** */
    QueryTimeout:number
    /** */
    Select( sql:String, param:Object=null, transaction:IDbTransaction=null, timeout:Nullable=null):Enumerable.IEnumerable<T>
    /** */
    Statement( sql:String, param:Object=null, transaction:IDbTransaction=null, timeout:Nullable=null):number
    /** */
    Sum( query:Query, column:String):T
}

declare class PaginationResult{
    /** */
    Count:Int64
    /** */
    Each:PaginationIterator
    /** */
    HasNext:Boolean
    /** */
    HasPrevious:Boolean
    /** */
    IsFirst:Boolean
    /** */
    IsLast:Boolean
    /** */
    List:Enumerable.IEnumerable<T>
    /** */
    Next( transaction:IDbTransaction=null, timeout:Nullable=null):PaginationResult
    /** */
    NextQuery():Query
    /** */
    Page:Int32
    /** */
    PerPage:Int32
    /** */
    Previous( transaction:IDbTransaction=null, timeout:Nullable=null):PaginationResult
    /** */
    PreviousQuery():Query
    /** */
    Query:Query
    /** */
    ToString():String
    /** */
    TotalPages:Int32
}
declare class PaginationIterator{
    /** */
    CurrentPage:PaginationResult
    /** */
    FirstPage:PaginationResult
    /** */
    GetEnumerator():Enumerable.IEnumerator<T>
    /** */
    ToString():String
}
declare function kata(name:string) :KataClass
/**
 * 
 * @param p {
 *   -- 'url':"API网址"  //用你的地址替换这里
 *   -- ,'method':'post'  //可用方法: get ,post
 *   -- ,'data':null  //使用form提交,不需要的话，用null替换冒号后的内容
 *   -- ,'json':null      //使用json提交，json 和data 不能同时有值，至少有一个是null
 *   -- ,'headers':null  
 }
 */
declare function web_request(p={
    'url':"API网址"  //用你的地址替换这里
    ,'method':'post'  //可用方法: get ,post
    ,'data':null  //使用form提交,不需要的话，用null替换冒号后的内容
    ,'json':null      //使用json提交，json 和data 不能同时有值，至少有一个是null
    ,'headers':null   
    });// 语句必须以逗号结束
declare class HttpResponseMessage{
      /** */
      CurrentPage:PaginationResult
      /** */
      FirstPage:PaginationResult
      /** */
      GetEnumerator():Enumerable.IEnumerator<T>
      /** */
      ToString():String
  }    
declare function web_request(p={
      'url':"API网址"  //用你的地址替换这里
      ,'method':'post'  //可用方法: get ,post
      ,'data':null  //使用form提交,不需要的话，用null替换冒号后的内容
      ,'json':null      //使用json提交，json 和data 不能同时有值，至少有一个是null
      ,'headers':null   
      },raw:boolean):HttpResponseMessage;// 语句必须以逗号结束    
/**
 *  根据布尔表达式的不同结果，返回不同的值
 */    
declare function iif(...restOfName)

/**
 * 例子： switchCase(param.xxx,  1,'x1',  2,'x2',  'x3')
 * 解释：当param。xxx为1时,返回x1，为2时，返回x2，否则返回x3
 */
declare function switchCase(...restOfName)
